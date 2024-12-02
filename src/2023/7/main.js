const aoc = require("../../aoc");

(async function main() {
  const lines = await aoc.processFile();

  const cards = () => ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse();
  const types = () => ["Five of a kind", "Four of a kind", "Full house", "Three of a kind", "Two pair", "One pair", "High card"].reverse();

  const isWildcard = (card) => card === "J";

  const typeScore = (type) => types().indexOf(type);
  const cardScore = (card) => cards().indexOf(card);

  const countCards = (hand) => {
    const counts = hand.split("").reduce((acc, card) => {
      acc[card] ??= 0;
      acc[card] += 1;
      return acc;
    }, {});
    return counts;
  }
  
  function getHandTypeWithWildcards(hand) {
    const counts = countCards(hand);

  }

  // wildcard J, so find best based on 3 and J becomes highest
  function getHandType(hand, usingWildcards = false) {
    const counts = countCards(hand);

    const wildcardCount = counts["J"] ?? 0;
    if (Object.keys(counts).length === 1) { // 5 cards
      return "Five of a kind";
    }
    if (Object.keys(counts).length === 2) { // 4 + 1 or 3+2
      return Object.entries(counts).reduce((acc, [card, count]) => {
        if (!usingWildcards || wildcardCount === 0) {
          if (count === 4) {
            return "Four of a kind";
          }
          if (count === 3) {
            return "Full house";
          }
        }

        if (!isWildcard(card)) {
          if (wildcardCount === 1) { // ???? + J
            return "Five of a kind";
          }
          if (wildcardCount === 2) { // ??? + JJ
            return "Five of a kind";
          }
          if (wildcardCount === 3) { // ?? JJJ
            return "Five of a kind";
          }
          if (wildcardCount === 4) { // ? JJJ
            return "Five of a kind";
          }
        }
        return acc;
      }, null);
    }
    if (Object.keys(counts).length === 3) { // AAABC AABBC
      const highestCount = Math.max(...Object.values(counts));
      return Object.entries(counts).reduce((acc, [card, count]) => {
        if (!usingWildcards || wildcardCount === 0) {
          if (count === 3) {
            return "Three of a kind";
          }

          if (count === 2) {
            return "Two pair";
          }
        }

        console.log("3", isWildcard(card), wildcardCount);
        if (!isWildcard(card)) {
          if (wildcardCount === 3) {
            return "Four of a kind";
          }
          if (wildcardCount === 2) {
            return "Four of a kind";
          }
          if (wildcardCount === 1) {
            if (highestCount === 3) {
              return "Four of a kind";
            }
            if (highestCount === 2) {
              return "Full house";
            }
          }
        }
        if (count === 3) {
          return "Four of a kind";
        }

        if (count === 2) {
          return "Four of a kind";
        }

        return acc;
      }, null);
    }
    if (Object.keys(counts).length === 4) { // AABCD
      // const highestCount = Math.max(...Object.values(counts));

      if (!usingWildcards || wildcardCount === 0) {
        return "One pair";
      }

      if (wildcardCount === 2) {
        return "Three of a kind";
      }
      if (wildcardCount === 1) {
        return "Three of a kind";
      }

      return "One pair";
    }
    if (Object.keys(counts).length === 5) { // ABCDE
      if (!usingWildcards || wildcardCount === 0) {
        return "High card";
      }

      if (wildcardCount === 1) {
        return "One pair";
      }

      return "High card";
    }

    return "High card";
  }

  const hands = [];
  for (line of lines) {
    console.log(line);

    const [hand, bid] = line.split(" ").map((x) => x.trim());
    const handType = getHandType(hand);
    const handScore = hand.split("").map(c => String.fromCharCode(65 + cardScore(c))).join("");

    const p2HandType = getHandType(hand, true);
    hands.push({
      hand,
      bid: +bid,
      handType,
      typeScore: typeScore(handType),
      handScore,
      sortRank: `${typeScore(handType)}${handScore}`,
      p2HandType,
      p2TypeScore: typeScore(p2HandType),
      p2SortRank: `${typeScore(p2HandType)}${handScore}`,
    });
  }
  console.log(hands);

  function sortHands(h, rankProperty) {
    const orderedHands = h.toSorted((a, b) => {
      if (a[rankProperty] > b[rankProperty]) {
        return 1;
      }
      if (a[rankProperty] < b[rankProperty]) {
        return -1;
      }
      return 0;
    });
    return orderedHands
  }

  function calculateWinnings(h) {
    return h.reduce((acc, hand, index) => {
      const winnings = hand.bid * (index + 1);
      console.log(`${hand.hand} ${hand.bid} ${index + 1} ${winnings} ${hand.handType} ${hand.p2HandType}`);
      return acc + winnings;
    }, 0);
  }

  const orderedHands = sortHands(hands, 'sortRank');
  console.log(orderedHands);
  const totalWinnings = calculateWinnings(orderedHands);
  console.log(totalWinnings);


  const p2OrderedHands = sortHands(hands, 'p2SortRank');
  console.log(p2OrderedHands);
  const p2TotalWinnings = calculateWinnings(p2OrderedHands);
  console.log(p2TotalWinnings);

})();

// 254088193 nope
// 246912307

// 246558228 too low
// 250688254 too high
// 246894760 OK

// J3JJ3 66 -> need to consider other numbers; this should be 33333