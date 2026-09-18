import { ReportData, REPORT_DOMAINS } from '../types';

/**
 * Generates exact Markdown matching the user's template
 */
export function generateMarkdown(data: ReportData): string {
  const isWeekly = data.reportType === 'weekly';
  const dateStr = isWeekly
    ? `الأسبوع ${data.weekNumber || '.....'} (${data.weekDateRange || 'من الأحد إلى الخميس'})`
    : `${data.dateDay || '.....'} / ${data.dateMonth || '.....'} / ${data.dateYear || '1448'} هـ`;
  const timeStr = isWeekly ? 'طوال الأسبوع الدراسي' : (data.timeOfDay || 'صباحاً / مساءً');

  const domainLines = REPORT_DOMAINS.map((domain) => {
    const isChecked = data.selectedDomains.includes(domain);
    return `* [${isChecked ? 'x' : ' '}] ${domain}`;
  });

  const otherChecked = data.selectedDomains.includes('أخرى') || !!data.otherDomain.trim();
  domainLines.push(`* [${otherChecked ? 'x' : ' '}] أخرى: ${data.otherDomain || '........................................................'}`);

  const observationRows = data.observations.map((obs, idx) => {
    return `| **${idx + 1}** | ${obs.description || ' '} | ${obs.status || ' '} |`;
  }).join('\n');

  return `---

**المملكة العربية السعودية**

**وزارة التعليم**

**إدارة التعليم بمحافظة جدة**

**ثانوية الأمير عبدالمجيد الأولى**

---

### **${isWeekly ? 'التقرير الأسبوعي الشامل للشؤون المدرسية والميدانية (جميع البنود)' : 'نموذج التقارير الإدارية والميدانية'}**

| بيانات التقرير | التفاصيل |
| --- | --- |
| **اسم التقرير / الموضوع:** | ${data.title || (isWeekly ? 'التقرير الأسبوعي الشامل لمتابعة الشؤون المدرسية' : '........................................................')} |
| **${isWeekly ? 'الأسبوع والفترة:' : 'التاريخ:'}** | ${dateStr} |
| **المعد / وكيل الشؤون المدرسية:** | ${data.preparedBy || 'عبدالله جمعان الشهري'} |
| **الوقت / النطاق:** | ${timeStr} |

---

### **مجال التقرير (اختر المجال المناسب):**

${domainLines.join('\n')}${data.domainDetails ? `\n\n**تحديد / تفاصيل المجال:** ${data.domainDetails}` : ''}

---

### **أبرز الملاحظات والرصد الميداني (${data.observations.length} بنداً):**

| م | وصف الملاحظة / البند | الحالة (سليم / يحتاج معالجة) |
| --- | --- | --- |
${observationRows}

---

### **المرئيات والتوصيات المقترحة:**

${data.recommendations || '........................................................................................................................................................................................................................................................................................................'}

---

| **وكيل الشؤون المدرسية** | **مدير المدرسة** |
| --- | --- |
| **الاسم:** ${data.schoolAgentName || 'عبدالله جمعان الشهري'} | **الاسم:** ${data.schoolPrincipalName || 'نايف أحمد الشهري'} |
| **التوقيع:** ............................ | **التوقيع:** ............................ |
`;
}

/**
 * Generates a clean plain text version for messaging and direct pasting
 */
export function generatePlainText(data: ReportData): string {
  const isWeekly = data.reportType === 'weekly';
  const dateStr = isWeekly
    ? `الأسبوع ${data.weekNumber || '.....'} (${data.weekDateRange || 'من الأحد إلى الخميس'})`
    : `${data.dateDay || '....'} / ${data.dateMonth || '....'} / ${data.dateYear || '1448'} هـ`;
  
  const selectedDomainsList = [
    ...data.selectedDomains.filter(d => d !== 'أخرى'),
    ...(data.otherDomain ? [`أخرى: ${data.otherDomain}`] : [])
  ];

  let obsText = '';
  data.observations.forEach((obs, idx) => {
    obsText += `\n${idx + 1}. ${obs.description || '(بدون وصف)'} [الحالة: ${obs.status || 'غير محدد'}]`;
  });

  return `المملكة العربية السعودية
وزارة التعليم - إدارة التعليم بمحافظة جدة
ثانوية الأمير عبدالمجيد الأولى

${isWeekly ? 'التقرير الأسبوعي الشامل للشؤون المدرسية والميدانية (جميع البنود)' : 'نموذج التقارير الإدارية والميدانية'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ بيانات التقرير:
• اسم التقرير / الموضوع: ${data.title || (isWeekly ? 'التقرير الأسبوعي الشامل لمتابعة الشؤون المدرسية' : '.......................')}
• ${isWeekly ? 'الأسبوع والفترة:' : 'التاريخ:'} ${dateStr}
• الوقت / النطاق: ${isWeekly ? 'طوال الأسبوع الدراسي' : (data.timeOfDay || 'صباحاً')}
• المعد / وكيل الشؤون المدرسية: ${data.preparedBy || 'عبدالله جمعان الشهري'}

■ مجال التقرير:
${selectedDomainsList.length > 0 ? selectedDomainsList.map(d => `• ${d}`).join('\n') : '• لم يتم تحديد المجال'}
${data.domainDetails ? `• تفاصيل وتحديد المجال: ${data.domainDetails}\n` : ''}
■ أبرز الملاحظات والرصد الميداني (${data.observations.length} بنداً):${obsText || '\n(لا توجد ملاحظات مسجلة)'}

■ المرئيات والتوصيات المقترحة:
${data.recommendations || '.......................................................'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
وكيل الشؤون المدرسية: ${data.schoolAgentName || 'عبدالله جمعان الشهري'}
مدير المدرسة: ${data.schoolPrincipalName || 'نايف أحمد الشهري'}
`;
}

