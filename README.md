# TTGCollector

A personal board game collection manager that helps you catalog your games quickly and decide what to play faster.

## Overview

TTGCollector is a full-stack PERN application for tracking tabletop games in your personal collection.  
You can add a game by name and pull details from BoardGameGeek, or manually enter full details when a title is not available.

Built as a solo project.

## Features

- Create a catalog of your board games by entering only the game name and pulling game information from BoardGameGeek.
- Manually add complete game details when a game is not available on BoardGameGeek.
- Quickly find what to play by filtering your collection by:
  - Player count
  - Duration
  - Player age
  - Game type (categories)
  - Game mechanics

## Tech Stack

### Frontend

- React
- Vite
- Bootstrap

### Backend

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Express Session for authentication/session handling

### External Data

- BoardGameGeek data integration (through backend routes)

## Project Structure

TTGCollector/
client/ # React + Vite frontend
server/ # Express + Sequelize backend
package.json # root scripts/dependencies

## Usage

1. Sign up or log in.
2. Add a game by name to search/import data from BoardGameGeek.
3. If no match is found, add the game manually.
4. Use filters to narrow your collection and choose a game quickly.

## Roadmap / Future Improvements

- Add a live deployed version
- Add the ability to edit existing game entries
- Add more sorting options (playtime, player count, name, etc.)
- Add automated test coverage
- Add pagination/virtualization for very large collections

## Author

Solo project by Anne Odom.

## License

This project is not currently licensed for public reuse.
