import * as cheerio from "cheerio";
import { AppError } from "../errors/app-error.js";

export async function fetchUrlContent(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new AppError(
            `Failed to fetch URL: ${response.status}`,
            502,
            "URL_FETCH_FAILED"
        );
    }

    const html = await response.text();

    const $ = cheerio.load(html);

    $("script, style, nav, footer, header, noscript").remove();

    const title = $("title").text().trim();

    const bodyText = $("body").text();

    const content = bodyText
        .replace(/\s+/g, " ")
        .trim();


    if (!content) {
        throw new AppError(
            "No readable content found at URL",
            422,
            "EMPTY_URL_CONTENT"
        );
    }

    return {
        title,
        content
    };
}