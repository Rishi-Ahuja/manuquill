import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun, PageBreak } from "docx";
import { saveAs } from "file-saver";

export const formatAndSaveDocument = async (jsonData, filename = "Document.docx") => {
  try {
    const { title, subtitle, authors, sections } = jsonData;

    const doc = new Document({
      sections: [
        {
          children: [
            ...createTitlePage({ title, subtitle, authors }),
            ...createSections(sections),
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

const createTitlePage = ({ title, subtitle, authors }) => {
  const paragraphs = [];

  // Title (Centered, Bold, Large)
  if (title) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            font: "Impact",
            size: 96, // 48pt size for title
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 1200, after: 400 },
      })
    );
  }

  // Subtitle (If provided, centered and italicized)
  if (subtitle) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: subtitle,
            italics: true,
            font: "Impact",
            size: 48, // 24pt size for subtitle
            color: "#505050",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );
  }

  // Authors Section
  if (authors && Array.isArray(authors.name) && authors.name.length > 0) {
    paragraphs.push(
      new Paragraph({
        text: "Authors:",
        bold: true,
        font: "Times New Roman",
        size: 32, // 16pt size for "Authors:"
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      })
    );

    authors.name.forEach((author) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: author,
              font: "Times New Roman",
              size: 28, // 14pt size for author names
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );
    });

    // Add course and date if available
    if (authors.course && authors.course !== "N/A") {
      paragraphs.push(
        new Paragraph({
          text: `Course: ${authors.course}`,
          font: "Times New Roman",
          size: 28,
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
        })
      );
    }

    if (authors.date && authors.date !== "N/A") {
      paragraphs.push(
        new Paragraph({
          text: `Date: ${authors.date}`,
          font: "Times New Roman",
          size: 28,
          alignment: AlignmentType.CENTER,
        })
      );
    }
  }

  // Add a page break
  paragraphs.push(new Paragraph({ children: [new PageBreak()] }));

  return paragraphs;
};

const createSections = (sections) => {
  const paragraphs = [];

  sections.forEach((section) => {
    if (section.Heading) {
      paragraphs.push(
        new Paragraph({
          text: section.Heading,
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 },
          font: "Times New Roman",
          size: 32, // 16pt size for headings
        })
      );
    }

    if (section.Content) {
      paragraphs.push(
        new Paragraph({
          text: section.Content,
          spacing: { after: 300 },
          font: "Times New Roman",
          size: 28, // 14pt size for content
        })
      );
    }
  });

  return paragraphs;
};
