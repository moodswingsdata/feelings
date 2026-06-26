# Feelings query language

A Feelings query is generally a series of "<keyword><punctuation><value>"s separate by whitespace.
If part of a query uses an unknown keyword, that portion should be ignored while the UI explains which search terms were invalid.

## Keywords

Keywords never contain spaces; if a value contains a space, it should be delimited by double-quotes. Multiple query fragments are AND'd together, unless the special keyword "or" is placed between them. Keywords are negated by leading with a "-". A bare word that isn't a recognized keyword should be treated as the `name` keyword.

There is a keyword for each card field:
- name (alias: n)
- id
- color (alias: c)
- dice (alias: d)
- dice_value (alias: dval)
- secondary_dice (aliases: dd, 2dice)
- secondary_dice_value (aliases: 2val, 2dval, ddval)
- rules text (alias: t) — the canonical oracle text
- notes (aliases: note, rulings, rul) — clarifying notes / rulings text
- timing (alias: tm) — when the card applies: `in_play`, `after_playing`, or `to_play`
- errata (alias: err) — whether the card or its printing has errata (also matches the errata note text)

There is a keyword for most printing fields:
- frame (alias: fr)
- reminder (alias: rem)
- rarity (alias: r)
- dicecolor (alias: dc)
- collectornumber (alias: cn)
- set (alias: set; this keyword also searches edition names if no results come up for set codes)
- treatment (alias: tr)
- artist (alias: a)
- headliner (alias: hl) — the editorial "is this the headliner printing" flag
- printedrules (aliases: printed, pt) — the as-printed rules text, when it differs from the oracle rules text

Boolean keywords (`headliner` and `errata`) accept `yes`/`true`/`1` and `no`/`false`/`0`. An empty value (e.g. `headliner:`) means "true". For `errata`, a non-boolean value searches the errata note text instead.

There are keywords for formatting the results:
- sort (values are the field to sort by, can reverse the sort order by prepending with a "-")
- as (values: cards (the default - the latest printing of a card, as an image), printings (all printings of card results), text (latest printing of a card, name only), textprintings (all printings of results, name only); prepending with hyphen makes no sense)

## Punctuation

By default, the punctuation mark is ":". This means an inclusive search. For example, "color:white" would include all cards that are white, even if they're multicolor and have other colors as well.

To be more strict, "=" is a valid punctuation mark. "color=white" would mean cards which are _only_ white, not any other color.

For numeric values, "=" and ":" are equivalent. Numeric values can also be compared with >, <, =>, and =<.

## Values

Values are generally bare strings, coerced into numbers where appropriate.

Values may be surrounded by double quotes. They _must_ be surrounded by double quotes if they contain whitespace.

Values may also be specified as regular expressions if they're surrounded by "/" characters.

Specific exceptions:
- Where dice notation is expected, the brackets are optional. "[5]" and "5" are equivalent. For double dice, ommitting the brackets requires quoting and using a space: "[6][1]" is equivalent to "6 1". Order still matters.
- For rules and reminder text, the value "~" in a query stands for "this card's name". So a search like note:"~ is worth" would return results like Altruism, whose notes read (in part) "Altruism is worth".

## Results

Results are returned as the latest printing of a given card unless a printing-specific keyword is present.

If a keyword requires a value and no value is given, treat it as either null or the empty string, whichever is appropriate for that field.

The "id" keyword is special in that it may match either a card ID or a printing ID. Because IDs are globally unique, there is no need to specify which kind of ID to look for.

Match on partial values, so for example, "c:w" would pick up white cards; "c:bl" would pick up blue and black cards, and so on.

## Example queries

- r:common c:white (all the common white cards in the game)
- love as:printings (all printings of the card Love in the game)
- r:mythic set:"Edition 1" (all the mythics from Edition 1)
- r:m set:msw (another way to write the previous query)
- a:"Magali Villeneuve" (the latest printing with art by Magali Villeneuve for each result)
- a:sper (finds artwork by Jakub Kasper and by Jesper Ejsing)
- a:/sper$/ (finds artwork by Jakub Kasper but NOT by Jesper Ejsing)

## Future work

The data model doesn't presently have release dates. We'll add that later and include new search queries for it.