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
} from "docx";
import { saveAs } from "file-saver";

export const formatAndSaveDocument = async (jsonData, filename = "Document.docx") => {
  try {
    // Destructure with defaults; note that authors may come from "Detailed author information"
    const { title = "Untitled", subtitle = "", authors, sections = [] } = jsonData;

    // Option to include a Table of Contents only if enabled in JSON.
    const includeTOC = jsonData.includeTOC || false;

    const doc = new Document({
      creator: "Your Name",
      title: title,
      description: "Project Report Document",
      styles: {
        paragraphStyles: [
          {
            id: "Heading1",
            name: "Heading 1",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 32, // 16pt
              bold: true,
              color: "2E74B5",
              font: "Calibri",
            },
            paragraph: {
              spacing: { after: 240 },
            },
          },
          {
            id: "Heading2",
            name: "Heading 2",
            basedOn: "Normal",
            next: "Normal",
            quickFormat: true,
            run: {
              size: 28, // 14pt
              bold: true,
              color: "2E74B5",
              font: "Calibri",
              underline: { type: UnderlineType.SINGLE, color: "2E74B5" },
            },
            paragraph: {
              spacing: { before: 200, after: 120 },
            },
          },
          {
            id: "NormalText",
            name: "Normal Text",
            run: {
              size: 24, // 12pt
              font: "Calibri",
            },
            paragraph: {
              spacing: { after: 120 },
            },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(1.25),
                right: convertInchesToTwip(1),
                bottom: convertInchesToTwip(1),
                left: convertInchesToTwip(1),
              },
            },
          },
          headers: {
            default: createHeader(title),
          },
          footers: {
            default: createFooter(), // Page numbers appear in the right-hand side.
          },
          children: [
            // Title page
            ...createTitlePage({ title, subtitle, authors }),
            new Paragraph({ children: [new PageBreak()] }),
            // Conditionally include a Table of Contents page.
            ...(includeTOC
              ? [
                  new Paragraph({
                    text: "Table of Contents",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                  }),
                  // You can add a TOC field here if desired.
                  new Paragraph({ children: [new PageBreak()] }),
                ]
              : []),
            // Document sections
            ...createSections(sections),
            // End-of-Document marker (inserted immediately after the last line)
            createEndOfDocument(),
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, filename);
  } catch (error) {
    console.error("Error generating Word document:", error);
    throw new Error("Failed to generate Word document.");
  }
};

/**
 * Creates a header that displays the document title.
 */
const createHeader = (title) => {
  return new Header({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 24, // 12pt
            font: "Calibri",
            color: "2E74B5",
          }),
        ],
        alignment: AlignmentType.LEFT,
      }),
      new Paragraph({
        children: [new TextRun({ text: " " })],
        border: {
          bottom: {
            color: "2E74B5",
            space: 1,
            size: 6,
            style: "single",
          },
        },
      }),
    ],
  });
};

/**
 * Creates a footer with page numbering aligned to the right.
 */
const createFooter = () => {
  return new Footer({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: "Page ",
            font: "Calibri",
            size: 20, // 10pt
          }),
          PageNumber.CURRENT,
          new TextRun({
            text: " of ",
            font: "Calibri",
            size: 20,
          }),
          PageNumber.TOTAL_PAGES,
        ],
        alignment: AlignmentType.RIGHT,
      }),
    ],
  });
};

/**
 * Generates the title page with an improved layout.
 * Uses Arial Rounded MT Bold for the title.
 * Only renders the author section if author data is provided.
 */
const createTitlePage = ({ title, subtitle, authors }) => {
  const paragraphs = [];

  // Top margin
  paragraphs.push(
    new Paragraph({
      text: "",
      spacing: { before: 400 },
    })
  );

  // Main Title using Arial Rounded MT Bold
  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: title,
          bold: true,
          font: "Arial Rounded MT Bold",
          size: 96, // 48pt
          color: "000000",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 600, after: 300 },
    })
  );

  // Subtitle, if provided
  if (subtitle && subtitle.trim().length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            italics: true,
            font: "Georgia",
            size: 48, // 24pt
            color: "555555",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 },
      })
    );
  }

  // Only include the Author section if authors are provided.
  if (authors && (Array.isArray(authors) || typeof authors === "object")) {
    const authorList = Array.isArray(authors) ? authors : [authors];
    if (authorList.length > 0) {
      paragraphs.push(
        new Paragraph({
          text: "Author(s):",
          bold: true,
          font: "Calibri",
          size: 32, // 16pt
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
          color: "2E74B5",
        })
      );
      authorList.forEach((author) => {
        const name = author.Name || author.name || "Unknown";
        const course = author.Course || author.course || "";
        const date = author.Date || author.date || "";
        const details = [name, course, date].filter(Boolean).join(" | ");
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: details,
                font: "Calibri",
                size: 28, // 14pt
                color: "333333",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          })
        );
      });
    }
  }

  // Extra spacing at the bottom of the title page
  paragraphs.push(
    new Paragraph({
      text: "",
      spacing: { after: 400 },
    })
  );

  return paragraphs;
};

/**
 * Converts JSON sections (including content, bullet points, and subsections) into document paragraphs.
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
          style: "Heading1",
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
          style: "NormalText",
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 300 },
        })
      );
    }

    // Bullet points in the section
    if (section.BulletPoints && Array.isArray(section.BulletPoints) && section.BulletPoints.length) {
      section.BulletPoints.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            text: bullet,
            bullet: { level: 0 },
            style: "NormalText",
            alignment: AlignmentType.LEFT,
          })
        );
      });
      paragraphs.push(
        new Paragraph({
          text: "",
          spacing: { after: 300 },
        })
      );
    }

    // Process subsections
    if (section.Subsections && Array.isArray(section.Subsections)) {
      section.Subsections.forEach((subsec) => {
        if (subsec.Subheading) {
          paragraphs.push(
            new Paragraph({
              text: subsec.Subheading,
              heading: HeadingLevel.HEADING_2,
              style: "Heading2",
              alignment: AlignmentType.LEFT,
              spacing: { before: 200, after: 100 },
            })
          );
        }
        if (subsec.Content && subsec.Content.trim().length > 0) {
          paragraphs.push(
            new Paragraph({
              text: subsec.Content,
              style: "NormalText",
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
                style: "NormalText",
                alignment: AlignmentType.LEFT,
              })
            );
          });
          paragraphs.push(
            new Paragraph({
              text: "",
              spacing: { after: 300 },
            })
          );
        }
      });
    }
  });

  return paragraphs;
};

/**
 * Creates an end-of-document marker.
 * In this case, a centered marker of *** is appended immediately after the last line.
 */
const createEndOfDocument = () => {
  return new Paragraph({
    children: [
      new TextRun({
        text: "***",
        italics: true,
        font: "Calibri",
        size: 28, // 14pt
        color: "555555",
      }),
    ],
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
  });
};
