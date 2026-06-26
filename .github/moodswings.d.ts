/**
 * Data models for Mood Swings card data.
 *
 * These interfaces document the shape of Card, Printing, and Edition records
 * as produced by the moodswings data pipeline (YAML output).
 */

/**
 * A unique card identity with its game-mechanical properties.
 */
export interface Card {
  /** Stable UUID5 generated from the card name. */
  id: string;

  /** The card's display name. */
  name: string;

  /** Card colors: e.g. ['White'], ['Blue', 'Black'], or [] for colorless. */
  color: ("White" | "Blue" | "Black" | "Red" | "Green")[];

  /** Primary dice notation, e.g. '[3]' or '[6][1]'. */
  dice: string;

  /** Integer sum of pips in the primary dice. */
  dice_value: number;

  /** Secondary dice notation after '/', or null. */
  secondary_dice: string | null;

  /** Integer sum of pips in the secondary dice, or null. */
  secondary_dice_value: number | null;

  /** HTML-formatted rules text (canonical oracle value), or null for vanilla cards. */
  rules_text: string | null;

  /**
   * Canonical timing tokens describing when a card's rules apply,
   * extracted from the bolded timing phrases.
   */
  timing: ("in_play" | "after_playing" | "to_play")[];

  /** List of clarifying note strings, or null if no notes exist. */
  notes: string[] | null;

  /** Errata flagging corrected fields, or null if none. */
  errata: Errata | null;
}

/**
 * A correction applied to a Card or Printing, flagging which fields changed.
 */
export interface Errata {
  /** Names of the fields that were corrected. */
  fields: string[];

  /** Human-readable explanation of the correction. */
  note: string;
}

/**
 * An edition or set of cards.
 */
export interface Edition {
  /** Stable UUID5 generated from set_code. */
  id: string;

  /** Set code, e.g. 'MSW'. */
  set_code: string;

  /** Human-readable edition name, e.g. 'Edition 1'. */
  edition_name: string;

  /** When this set first came out. */
  release_date: Date;

  /** Language code, like 'en' or 'es-mx'. */
  language: string;
}

/**
 * A specific physical printing of a card.
 */
export interface Printing {
  /** Stable UUID5 generated from card_name:set_code:collector_number. Null until collector_number is known. */
  id: string | null;

  /** References the Card.id this printing belongs to. */
  card_id: string;

  /** References the Edition.id this printing belongs to. */
  edition_id: string;

  /** Frame color/style. */
  frame: "White" | "Blue" | "Black" | "Red" | "Green";

  /** Reminder icon glyph (e.g. '!') or null. */
  reminder_icon: string | null;

  /** Card rarity. */
  rarity: "Common" | "Uncommon" | "Rare" | "Mythic Rare";

  /** Color of the physical die: 'white', 'black', or null if unknown. */
  dice_color: "white" | "black" | null;

  /** Collector number within the set, or null if unknown. */
  collector_number: number | null;

  /** Print treatment, e.g. 'Standard', 'Foil'. */
  treatment: string;

  /** Artist name, array for multi-artist credits, or null if unknown. */
  artist: string | string[] | null;

  /** URL to the card image, or null if unavailable. */
  card_image_url: string | null;

  /**
   * Editorial flag marking an edition's headliner printing
   * (Edition 1: Love #134). Defaults to false.
   */
  is_headliner: boolean;

  /**
   * The as-printed rules text when it differs from the card's oracle
   * `rules_text`, or null when identical.
   */
  printed_rules_text: string | null;

  /** Errata flagging corrected fields, or null if none. */
  errata: Errata | null;
}
