// documentUtils.js
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  AlignmentType,
  TextRun,
  PageBreak,
  Header,
  Footer,
  convertInchesToTwip,
  PageNumber,
  UnderlineType,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";

/**
 * Generates and downloads a playful project report document from structured JSON data.
 * Uses keys as provided by your unchanged openaiAPI.js file:
 * - Title, Subtitle, Author, and Sections.
 *
 * This template splits the document into two sections:
 * 1. The Cover Page section – vertically centered.
 * 2. The Main Content section – with normal top alignment.
 *
 * @param {Object} jsonData - The structured JSON data.
 * @param {string} [filename="PlayfulProjectReport.docx"] - The output filename.
 */
export const formatAndSaveDocument = async (jsonData, filename = "PlayfulProjectReport.docx") => {
  try {
    const { title = "Untitled", subtitle = "", authors, sections = [] } = jsonData;
    const includeTOC = jsonData.includeTOC || false;

    const doc = new Document({
      creator: "Your Name",
      title: title,
      description: "Playful Project Report Document",
      styles: {
        paragraphStyles: [
          {
            id: "PlayfulHeading1",
            name: "Playful Heading 1",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial Rounded MT Bold",
              bold: true,
              size: 32, // 16pt
              color: "FFD700", // Gold
            },
            paragraph: {
              spacing: { after: 240 },
            },
          },
          {
            id: "PlayfulHeading2",
            name: "Playful Heading 2",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Arial Rounded MT Bold",
              bold: true,
              size: 28, // 14pt
              color: "32CD32", // Lime Green
              underline: { type: UnderlineType.SINGLE, color: "32CD32" },
            },
            paragraph: {
              spacing: { before: 200, after: 120 },
            },
          },
          {
            id: "PlayfulNormal",
            name: "Playful Normal",
            run: {
              font: "Comic Sans MS",
              size: 24, // 12pt
              color: "333333",
            },
            paragraph: {
              spacing: { after: 120 },
            },
          },
        ],
      },
      sections: [
        // SECTION 1: Cover Page (vertically centered)
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1.25),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
              // Vertically center all content in this section.
              verticalAlign: VerticalAlign.CENTER,
            },
          },
          headers: {
            default: createPlayfulHeader(title),
          },
          footers: {
            default: createPlayfulFooter(),
          },
          children: [
            ...createCoverPage({ title, subtitle, authors }),
            new Paragraph({ children: [new PageBreak()] }),
          ],
        },
        // SECTION 2: Main Content (normal vertical alignment)
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1.25),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
              // Default vertical alignment (top)
            },
          },
          headers: {
            default: createPlayfulHeader(title),
          },
          footers: {
            default: createPlayfulFooter(),
          },
          children: [
            // Optional Table of Contents
            ...(includeTOC
              ? [
                  new Paragraph({
                    text: "Table of Contents",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                  }),
                  // (TOC field codes could be added here if desired)
                  new Paragraph({ children: [new PageBreak()] }),
                ]
              : []),
            // Document Sections
            ...createSections(sections),
            // End-of-Document Marker (immediately after last content)
            createEndOfDocument(),
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, filename);
  } catch (error) {
    console.error("Error generating Playful project report document:", error);
    throw new Error("Failed to generate document.");
  }
};

/**
 * Creates a playful header with the title in a fun font and a colorful bottom border.
 */
const createPlayfulHeader = (title) => {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            font: "Comic Sans MS",
            size: 24,
            color: "FF69B4", // Hot Pink
          }),
        ],
        alignment: AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [new TextRun({ text: " " })],
        border: {
          bottom: {
            color: "00BFFF", // Deep Sky Blue
            space: 2,
            size: 12, // Thick border
            style: "single",
          },
        },
      }),
    ],
  });
};

/**
 * Creates a playful footer with centered page numbering in a vibrant color.
 */
const createPlayfulFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "Page ",
            font: "Comic Sans MS",
            size: 20,
            color: "FF1493", // Deep Pink
          }),
          PageNumber.CURRENT,
          new TextRun({
            text: " of ",
            font: "Comic Sans MS",
            size: 20,
            color: "FF1493",
          }),
          PageNumber.TOTAL_PAGES,
        ],
        alignment: AlignmentType.CENTER,
      }),
    ],
  });
};

/**
 * Creates the cover page.
 * The title is rendered using inline TextRun properties with "Marker Felt Wide",
 * the subtitle with "Comic Sans MS", and the author section (if provided) is shown.
 * A decorative thick blue divider is added.
 */
const createCoverPage = ({ title, subtitle, authors }) => {
  const paragraphs = [];

  // Main Title using Marker Felt Wide (inline formatting)
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          font: "Marker Felt Wide", // Ensure this font is installed on your system!
          bold: true,
          size: 96, // 48pt (docx sizes are in half-points)
          color: "FF4500", // Orange Red
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 300 },
      // No style attribute here so inline settings take precedence.
    })
  );

  // Subtitle using Comic Sans MS inline formatting (if provided)
  if (subtitle && subtitle.trim().length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            font: "Comic Sans MS",
            italics: true,
            size: 48, // 24pt
            color: "00CED1", // Dark Turquoise
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );
  }

  // Author Section: Render only if author data exists.
  if (authors && (Array.isArray(authors) || typeof authors === "object")) {
    const authorList = Array.isArray(authors) ? authors : [authors];
    if (authorList.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: "By:",
          bold: true,
          font: "Comic Sans MS",
          size: 32,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          color: "FF4500", // Orange Red
        })
      );
      authorList.forEach((author) => {
        const name = author.Name || author.name || "";
        if (name.trim().length > 0) {
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: name,
                  font: "Comic Sans MS",
                  size: 28,
                  color: "333333",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 },
            })
          );
        }
      });
    }
  }

  // Add a decorative thick blue divider.
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: "" })],
      border: {
        bottom: {
          color: "00BFFF",
          space: 4,
          size: 12,
          style: "single",
        },
      },
      spacing: { before: 300, after: 300 },
    })
  );

  return paragraphs;
};

/**
 * Converts the JSON sections (including content, bullet points, and subsections)
 * into playful, styled document paragraphs.
 */
const createSections = (sections) => {
  const paragraphs = [];

  sections.forEach((section, sectionIndex) => {
    // Section Heading
    if (section.Heading) {
      paragraphs.push(
        new Paragraph({
          text: section.Heading,
          heading: HeadingLevel.HEADING_1,
          style: "PlayfulHeading1",
          alignment: AlignmentType.LEFT,
          spacing: { before: sectionIndex === 0 ? 0 : 400, after: 200 },
        })
      );
    }

    // Section Content
    if (section.Content && section.Content.trim().length > 0) {
      paragraphs.push(
        new Paragraph({
          text: section.Content,
          style: "PlayfulNormal",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
        })
      );
    }

    // Bullet Points (if provided)
    if (section.BulletPoints && Array.isArray(section.BulletPoints) && section.BulletPoints.length) {
      section.BulletPoints.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            style: "PlayfulNormal",
            alignment: AlignmentType.LEFT,
          })
        );
      });
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 300 } }));
    }

    // Process Subsections
    if (section.Subsections && Array.isArray(section.Subsections)) {
      section.Subsections.forEach((subsec) => {
        if (subsec.Subheading) {
          paragraphs.push(
            new Paragraph({
              text: subsec.Subheading,
              heading: HeadingLevel.HEADING_2,
              style: "PlayfulHeading2",
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 100 },
            })
          );
        }
        if (subsec.Content && subsec.Content.trim().length > 0) {
          paragraphs.push(
            new Paragraph({
              text: subsec.Content,
              style: "PlayfulNormal",
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 300 },
            })
          );
        }
        if (subsec.BulletPoints && Array.isArray(subsec.BulletPoints) && subsec.BulletPoints.length) {
          subsec.BulletPoints.forEach((bullet) => {
            paragraphs.push(
              new Paragraph({
                text: bullet,
                bullet: { level: 1 },
                style: "PlayfulNormal",
                alignment: AlignmentType.LEFT,
              })
            );
          });
          paragraphs.push(new Paragraph({ text: "", spacing: { after: 300 } }));
        }
      });
    }
  });

  return paragraphs;
};

/**
 * Creates an end-of-document marker.
 * A centered *** is added immediately after the last content.
 */
const createEndOfDocument = () => {
  return new Paragraph({
    children: [
      new TextRun({
        text: "***",
        italics: true,
        font: "Comic Sans MS",
        size: 28,
        color: "FF69B4", // Hot Pink
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
  });
};
