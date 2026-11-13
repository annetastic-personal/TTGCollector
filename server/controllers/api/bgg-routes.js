const router = require("express").Router();
const axios = require("axios");
const xml2js = require("xml2js");
require("dotenv").config({ quiet: true });

router.get("/search/:query", async (req, res) => {
  try {
    const offset = Math.max(parseInt(req.query.offset || "0", 10), 0);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "20", 10), 1),
      100,
    );

    const response = await axios.get(
      `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(req.params.query)}&type=boardgame`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BGG_API_TOKEN}`,
          "User-Agent": "TTGCollector/1.0",
          Accept: "application/xml",
        },
      },
    );

    xml2js.parseString(
      response.data,
      { explicitArray: false },
      async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Failed to parse BGG response" });
        }

        const items = result?.items?.item;
        if (!items) {
          return res.json({
            results: [],
            total: 0,
            offset,
            limit,
            hasMore: false,
            nextOffset: offset,
          });
        }

        const itemArray = Array.isArray(items) ? items : [items];

        const getSearchName = (item) => {
          const names = Array.isArray(item.name)
            ? item.name
            : item.name
              ? [item.name]
              : [];
          return (
            names.find((n) => n.$?.type === "primary")?.$?.value ||
            names[0]?.$?.value ||
            ""
          );
        };

        const sortedItems = [...itemArray].sort((a, b) =>
          getSearchName(a).localeCompare(getSearchName(b)),
        );

        const total = sortedItems.length;
        const pagedItems = sortedItems.slice(offset, offset + limit);
        const ids = pagedItems.map((item) => item.$.id);

        if (ids.length === 0) {
          return res.json({
            results: [],
            total,
            offset,
            limit,
            hasMore: false,
            nextOffset: offset,
          });
        }

        // Fetch details for all ids in one call
        const detailsResponse = await axios.get(
          `https://boardgamegeek.com/xmlapi2/thing?id=${ids.join(",")}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.BGG_API_TOKEN}`,
              "User-Agent": "TTGCollector/1.0",
              Accept: "application/xml",
            },
          },
        );

        xml2js.parseString(
          detailsResponse.data,
          { explicitArray: false },
          (err2, detailsResult) => {
            if (err2) {
              return res
                .status(500)
                .json({ error: "Failed to parse BGG details response" });
            }

            const things = detailsResult?.items?.item;
            if (!things) return res.json([]);

            const thingsArray = Array.isArray(things) ? things : [things];

            const mapped = thingsArray.map((item) => {
              const links = Array.isArray(item.link)
                ? item.link
                : item.link
                  ? [item.link]
                  : [];
              const getLinks = (type) =>
                links.filter((l) => l.$.type === type).map((l) => l.$.value);

              const names = Array.isArray(item.name)
                ? item.name
                : item.name
                  ? [item.name]
                  : [];
              const primaryName =
                names.find((n) => n.$.type === "primary")?.$.value ||
                names[0]?.$.value ||
                null;

              return {
                id: item.$.id,
                thumbnail: item.thumbnail || null,
                name: primaryName,
                description: item.description || null,
                yearpublished: item.yearpublished?.$.value || null,
                minplayers: item.minplayers?.$.value || null,
                maxplayers: item.maxplayers?.$.value || null,
                minplaytime: item.minplaytime?.$.value || null,
                maxplaytime: item.maxplaytime?.$.value || null,
                minage: item.minage?.$.value || null,
                boardgamecategory: getLinks("boardgamecategory"),
                boardgamemechanic: getLinks("boardgamemechanic"),
              };
            });

            const byId = new Map(mapped.map((m) => [String(m.id), m]));
            const orderedResults = ids
              .map((id) => byId.get(String(id)))
              .filter(Boolean);

            const nextOffset = offset + limit;
            res.json({
              results: orderedResults,
              total,
              offset,
              limit,
              hasMore: nextOffset < total,
              nextOffset,
            });
          },
        );
      },
    );
  } catch (error) {
    console.error("BGG API status:", error.response?.status);
    console.error("BGG API data:", error.response?.data);
    console.error("BGG API message:", error.message);
    res.status(500).json({
      error: "External API error",
      details: error.message,
      bggStatus: error.response?.status,
      bggData: error.response?.data,
    });
  }
});

module.exports = router;
