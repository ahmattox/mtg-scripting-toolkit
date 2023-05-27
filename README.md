# MTG Scripting Toolkit

A Typescript toolkit for working with and analyzing MTG card data. It includes
functions for fetching data from a number of Magic sources: most importantly
[Scryfall](https://scryfall.com)'s API and bulk data sets but also
[Cube Cobra](http://cubecobra.com), [Moxfield](http://cubecobra.com), and the
[Commander Spellbook](https://commanderspellbook.com). It also includes
utilities for filtering, sorting, and transforming card data.

These tools have been written for personal curiosity or as part of
[Lucky Paper](https://luckypaper.co/) projects. It's published in the hope it
can useful to others as a scripting context for analyzing or transforming MTG
card data. It's not structured, licensed, or versioned to be an integrated
package in other projects. Nothing, including API coverage or types, is
guaranteed to be complete or accurate as it's been written ad-hoc for my own
needs.

If it's useful or you need some help,
[let me know](https://twitter.com/ahmattox)!

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

Create a script or copy [an example](scripts/examples).

Run scripts with tsx, a utility for executing Typescript files.

```sh
$ yarn run tsx ./scripts/my-script-file-name
```

In the [example scripts](scripts/examples), input and output is handled a few
ways. Input may be arguments or prompts, and may be paths to files for working
with things like lists of cards. Since this is intended for quick data analysis
and transformation, output is mostly just printed to the console for simplicity.

See comments in [individual examples](scripts/examples) for more specific kinds
of things you can do.

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
>
> Scraping Moxfield is against their TOS. Do not use this to extract data en
> masse.

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

### Commander Spellbook

`utils/commander-spellbook` fetches and enriches the database of cards from the
Commander Spellbook. The card objects from Scryfall are added to combos. Note
that many of the fields on these combos are intended to be human readable. For
example the 'results' are worded consistently, but include many specific
variations.

```typescript
import * as spellbook from 'utils/commander-spellbook'

import { log } from 'utils/log'

async function main() {
    // Fetch all combos in the spell book
    const combos = await spellbook.fetchCommanderSpellbook()

    // E.g. filter for combos that include a specific result
    const infiniteCombatCombos = combos.filter((combo) =>
        combo.results?.includes('Infinite combat phases')
    )

    log(
        infiniteCombatCombos
            .map((combo) => combo.cardNames.join(', '))
            .join('\n')
    )

    // ...
}

main()
```

### Academy Ruins

[Academy Ruins](https://academyruins.com) preserves an archive of changes to
Magic's comprehensive rules over time. You can fetch the current rules at the
release of any set.

### MTG Utilities

The `mtg` utilities directory includes functions for things you might want to do
with Magic card data. Tools include sorting cards by color in the traditional
way, grouping cards by type, or filtering reprints and variants from a set of
cards.

See comments in individual files for details.

## Caching

Scryfall's bulk data, and some other expensive data sets, are cached. Reset the
cache to reload fresh data the next time you run a script.

```sh
$ yarn cache:clear
```

## Contact

Questions, comments, issues, or just want to talk about Magic and data? Find me
on [twitter](https://twitter.com/ahmattox) or
[Discord](https://discordapp.com/users/226747568866983938).
