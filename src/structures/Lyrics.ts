import fetch from "node-fetch";
import { load } from "cheerio";

class Lyrics {
    // baseUrl: string;
    constructor() {
        // this.baseUrl = "https://genius.com";
    }
    async getLyrics(song: string) {
        const url = `https://search.azlyrics.com/search.php?q=${encodeURIComponent(song)}`;
        const response = await fetch(url);
        const html = await response.text();
        const $ = load(html);
        const link = $("td.visitedlyr").first();
        const href = link.children("a").attr("href");
        const title = link.text().split(".").slice(1).join(".").trim();
        if (href) {
            const lyrics = await this.getLyricsPage(href);
            return { title, lyrics };
        }
    }
    async getLyricsPage(url: string) {
        const response = await fetch(url);
        const html = await response.text();
        const $ = load(html);
        const lyrics = $("div.col-xs-12.col-lg-8.text-center").children("div:not([class])").text().trim();
        return lyrics;
    }
}

export default Lyrics;
