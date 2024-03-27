const fs = require('fs');
const { PDFDocument, degrees } = require('pdf-lib');

async function rotatePDF(inputPath, outputPath, rotationAngle) {
    const pdfBytes = await fs.promises.readFile(inputPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        page.setRotation(degrees(rotationAngle));
    }

    const modifiedPdfBytes = await pdfDoc.save();
    await fs.promises.writeFile(outputPath, modifiedPdfBytes);
    
    console.log('PDF rotated and saved:', outputPath);
}


// Uncomment and edit the following lines to rotate PDFs
/**
 * const inputPath = './file-input.pdf';      // Replace with your input PDF file path
 * const outputPath = './file-output.pdf';    // Replace with the desired output PDF file path
 * const rotationAngle = 90;           // Rotation angle in degrees (90 for clockwise)
 * rotatePDF(inputPath, outputPath, rotationAngle);
 */

async function mergePDFs() {
    const pdfs = ["pdf1.pdf", "pdf2.pdf"];
    const pdfsToMerge = [];
    pdfs.forEach(pdf => {
        pdfsToMerge.push(fs.readFileSync(pdf));
    });
    
    const mergedPdf = await PDFDocument.create(); 
    for (const pdfBytes of pdfsToMerge) { 
        const pdf = await PDFDocument.load(pdfBytes); 
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
             mergedPdf.addPage(page); 
        }); 
    } 
    
    const buf = await mergedPdf.save();        // Uint8Array
    
    let path = 'merged.pdf'; 
    fs.open(path, 'w', function (err, fd) {
        fs.write(fd, buf, 0, buf.length, null, function (err) {
            fs.close(fd, function () {
                console.log('wrote the file successfully');
            }); 
        }); 
    });
}

mergePDFs();