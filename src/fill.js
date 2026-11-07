// Fills the fillable packet template from one hr_enrollments row. Works in browser (window.PDFLib) and node.
async function fillPacket(PDFLib, templateBytes, row) {
  const { PDFDocument } = PDFLib;
  const doc = await PDFDocument.load(templateBytes);
  const form = doc.getForm();
  const d = row.data || {};
  const pageOf = { DD_: 0, I9_: 1, W4_: 2 };
  for (const f of form.getFields()) {
    const name = f.getName();
    const v = d[name];
    if (v === undefined || v === null || v === "" || v === false) continue;
    try {
      if (f instanceof PDFLib.PDFTextField) f.setText(String(v));
      else if (f instanceof PDFLib.PDFDropdown) { f.select(String(v)); try { f.setFontSize(9); } catch (e) {} }
      else if (f instanceof PDFLib.PDFRadioGroup) f.select(String(v));
      else if (f instanceof PDFLib.PDFCheckBox) { if (v === true || v === "Yes") f.check(); }
    } catch (e) { console.warn("field", name, e.message); }
  }
  // place drawn signature images where the signature boxes are
  const sigs = row.signatures || {};
  for (const f of form.getFields()) {
    if (!(f instanceof PDFLib.PDFSignature)) continue;
    const name = f.getName();
    const png = sigs[name] || (/EmployeeSignature$/.test(name) ? sigs.employee : name === "I9_EmployerSignature" ? sigs.employer : null);
    if (!png) continue;
    const rect = f.acroField.getWidgets()[0].getRectangle();
    const page = doc.getPage(pageOf[name.slice(0, 3)]);
    const img = await doc.embedPng(png);
    const s = Math.min(rect.width / img.width, rect.height / img.height);
    const w = img.width * s, h = img.height * s;
    page.drawImage(img, { x: rect.x + 2, y: rect.y + (rect.height - h) / 2, width: w, height: h });
    form.removeField(f);
  }
  form.acroForm.dict.set(PDFLib.PDFName.of('NeedAppearances'), PDFLib.PDFBool.False);
  return await doc.save();
}
if (typeof module !== "undefined") module.exports = { fillPacket };
