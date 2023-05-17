# MTG Scripting Toolkit

A Typescript toolkit for working with and analyzing MTG card data. It includes
functions for fetching data from Scryfall's API and bulk data sources, fetching
lists from Cube Cobra and Moxfield, and utilities for transforming, filtering,
sorting, and transforming card data.

These tools have been written for personal curiosity or as part of
[Lucky Paper](https://luckypaper.co/) projects. It's published in case it could
be useful to others as a scripting context for analyzing MTG card data. It's not
structured or licensed to be an integrated package in other projects. Nothing,
including API coverage or types, is guaranteed to be complete or accurate as
it's been written ad-hoc for my own needs.

## Using the Repo

### Install Dependencies

Node 18 is required. You can use [nvm](https://github.com/nvm-sh/nvm) to manage
node versions and run `nvm install` and subsequently `nvm use` in this directory
to use the correct version.

In this directory install dependencies with [Yarn](https://yarnpkg.com):

```sh
    $ yarn install
```

### Create a script

Create a script or copy an example.

Run scripts with tsx, a utility for executing Typescript files.

```sh
    $ yarn run tsx ./scripts/my-script-file-name
```

## Components

The `utils` directory includes a handful of general purpose utility functions
and directories for loading and working with data from Scryfall, Cube Cobra,
Moxfield, and some general purpose MTG specific tools.

It's recommended to import the index file of utility sub-directories.

### Scryfall

The `utils/scryfall` directly includes tools for interacting with Scryfall's
API. These mostly mirror Scryfall's API endpoints and include type checking for
parameters and results.

Types have been written based on Scryfall's API documentation and experimentally
based on looking at results. These aren't necessarily complete or correct, but
just cover the needs I've encountered.

```typescript
import * as scryfall from 'utils/scryfall'

async function main() {
    // Fetch data from Scryfall with a query
    const queriedCards = await scryfall.search(`o:saproling`)

    // Fetch complete bulk data sets from Scryfall
    const bulkDataCards = await scryfall.fetchBulkData('oracle_cards')

    // Fetch a set of cards by name, or other identifying attributes
    const collectionCards = await scryfall.fetchCollection([
        'Mycologist',
        'Saproling Burst',
        'Saproling Migration'
    ])

    // Fetch information about a set, or all sets
    const set = await scryfall.fetchSet('DOM')

    // ...
}

main()
```

### Cube Cobra

The `utils/cube-cobra` directory includes functions for loading data from
[Cube Cobra](https://cubecobra.com)'s list and JSON endpoints and types for the
JSON structure.

```typescript
import * as cubeCobra from 'utils/cube-cobra'

async function main() {
    const cubeID = 'regular'

    // Fetch Cube information from Cube Cobra including card IDs and metadata
    const cube = await cubeCobra.fetchCube(cubeID)

    // Fetch the list of all card names in a Cube
    const cardNames = await cubeCobra.fetchCubeList(cubeID)

    // Fetch the full card data from Scryfall for each card in the Cube,
    // respecting chosen printings.
    const cards = await cubeCobra.fetchCubeCards(cubeID)

    // ...
}

main()
```

### Moxfield

The 'utils/moxfield' directory includes tools for fetching decklists from
Moxfield.

Types have been written based on example scripts. They cover cases I've
encountered but aren't necessarily complete or accurate.

> Note that the Moxfield API isn't public or documented. Although we can access
> and use it, it's not guaranteed to be stable in the future and couldn't be
> fetched in a browser.

```typescript
import * as moxfield from 'utils/moxfield'

async function main() {
    // Fetch all data about a deck from Moxfield
    const deck = await moxfield.getDeck(
        'https://www.moxfield.com/decks/zjLly58vpkGltgcS7eO-ig'
    )

    // Extract the list of card names from the deck object.
    const cardNames = moxfield.cardNamesFromDeck(deck)

    // ...
}

main()
```

### MTG Utilities

The `mtg` utilities directory includes functions for things you might want to do
with Magic card data. Tools include sorting cards by color in the traditional
way, grouping cards by type, or filtering reprints and variants from a set of
cards.

## Caching

Scryfall's bulk data requests are cached. Run `yarn cache:clear` to reset the
cache and reload new data on the next run.

## Contact

Questions, comments, issues, or just want to talk about Magic and data? Find me
on [twitter](https://twitter.com/ahmattox) or
[Discord](https://discordapp.com/users/226747568866983938).
