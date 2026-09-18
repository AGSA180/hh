export type ObservationStatus = 'سليم' | 'يحتاج معالجة' | '';
export type ReportType = 'daily' | 'weekly';

export interface ObservationItem {
  id: string;
  description: string;
  status: ObservationStatus;
}

export interface AttachedImage {
  id: string;
  dataUrl: string;
  caption: string;
}

export interface ReportData {
  reportType?: ReportType;
  dayName?: string;
  weekNumber?: string;
  weekDateRange?: string;
  semester?: string;
  title: string;
  dateDay: string;
  dateMonth: string;
  dateYear: string;
  preparedBy: string;
  timeOfDay: 'صباحاً' | 'مساءً' | '';
  selectedDomains: string[];
  otherDomain: string;
  domainDetails?: string;
  observations: ObservationItem[];
  recommendations: string;
  schoolAgentName: string;
  schoolPrincipalName: string;
  images?: AttachedImage[];
}

export const REPORT_DOMAINS: string[] = [
  'أمن وسلامة',
  'صيانة',
  'جولة ميدانية',
  'نظافة',
  'زيارة للمقصف',
  'زيارة للفصول',
  'برنامج مدرسي',
  'متابعة عمل الإداريين',
  'الميزانية التشغيلية',
  'المقصف المدرسي',
  'الصندوق المدرسي',
  'بواب المدرسة',
];

export const WEEKLY_STANDARD_ITEMS: { id: string; domain: string; description: string; status: ObservationStatus }[] = [
  {
    id: 'w-1',
    domain: 'أمن وسلامة',
    description: 'أمن وسلامة: فحص مخارج الطوارئ ومضخات الحريق وطفايات الحريق ومعدات السلامة',
    status: 'سليم',
  },
  {
    id: 'w-2',
    domain: 'صيانة',
    description: 'صيانة عامة: متابعة كفاءة المكيفات والإنارة والتمديدات الكهربائية والسباكة',
    status: 'سليم',
  },
  {
    id: 'w-3',
    domain: 'جولة ميدانية',
    description: 'جولة ميدانية: تفقد الممرات، الأفنية المدرسية، الصالات، والأسوار الخارجية',
    status: 'سليم',
  },
  {
    id: 'w-4',
    domain: 'نظافة',
    description: 'نظافة عامة: الإشراف على نظافة الفصول ودورات المياه والممرات والمرافق',
    status: 'سليم',
  },
  {
    id: 'w-5',
    domain: 'زيارة للمقصف',
    description: 'المقصف المدرسي: مطابقة المواد الغذائية والوجبات المعتمدة والشهادات الصحية للعاملين',
    status: 'سليم',
  },
  {
    id: 'w-6',
    domain: 'زيارة للفصول',
    description: 'البيئة الصفية: سلامة المقاعد والسبورات والتهوية والإضاءة داخل الفصول الدراسية',
    status: 'سليم',
  },
  {
    id: 'w-7',
    domain: 'برنامج مدرسي',
    description: 'البرامج المدرسية: متابعة انضباط الاصطفاف الصباحي والإذاعة والفعاليات المدرسية',
    status: 'سليم',
  },
  {
    id: 'w-8',
    domain: 'متابعة عمل الإداريين',
    description: 'متابعة الإداريين: انضباط الكادر الإداري وسجلات الحضور والمهام المنجزة',
    status: 'سليم',
  },
  {
    id: 'w-9',
    domain: 'الميزانية التشغيلية',
    description: 'الميزانية التشغيلية: متابعة أوجه الصرف وفواتير المستلزمات المعتمدة نظاماً',
    status: 'سليم',
  },
  {
    id: 'w-10',
    domain: 'المقصف المدرسي',
    description: 'لجنة المقصف: المتابعة اليومية للاشتراطات وملاحظات الطلاب على التغذية',
    status: 'سليم',
  },
  {
    id: 'w-11',
    domain: 'الصندوق المدرسي',
    description: 'الصندوق المدرسي: تدقيق السجلات المالية والمقبوضات والمصروفات النثرية',
    status: 'سليم',
  },
  {
    id: 'w-12',
    domain: 'بواب المدرسة',
    description: 'بواب وحارس المدرسة: انضباط التواجد، تدقيق سجلات الزوار، وسلامة إغلاق البوابات',
    status: 'سليم',
  },
];

export const INITIAL_REPORT_DATA: ReportData = {
  reportType: 'daily',
  dayName: 'الأحد',
  weekNumber: 'الأول',
  weekDateRange: 'من الأحد إلى الخميس',
  semester: 'الفصل الدراسي الأول',
  title: 'تقرير المتابعة الإدارية والميدانية اليومي',
  dateDay: '15',
  dateMonth: '03',
  dateYear: '1448',
  preparedBy: 'عبدالله جمعان الشهري',
  timeOfDay: 'صباحاً',
  selectedDomains: ['أمن وسلامة', 'جولة ميدانية', 'نظافة'],
  otherDomain: '',
  domainDetails: 'متابعة ميدانية يومية لسير الاصطفاف الصباحي، البيئة الصفية، ونظافة المرافق المدرسية',
  observations: [
    { id: '1', description: 'متابعة اكتمال تجهيزات طفايات الحريق ومخارج الطوارئ ومسارات الإخلاء', status: 'سليم' },
    { id: '2', description: 'تفقد الفصول الدراسية في الدورين الأول والثاني وجاهزية المقاعد وأجهزة التكييف', status: 'سليم' },
    { id: '3', description: 'الإشراف على النظافة العامة لدورات المياه والفناء الخارجي وتوفر المعقمات', status: 'سليم' },
    { id: '4', description: 'متابعة انضباط حضور الطلاب والاصطفاف الصباحي والإشراف الميداني', status: 'سليم' },
  ],
  recommendations: '• استمرار جولات المتابعة الميدانية اليومية في بداية ونهاية الدوام.\n• التأكيد على مشرفي الأدوار بتكثيف الحضور أثناء الفسحة وانصراف الطلاب.',
  schoolAgentName: 'عبدالله جمعان الشهري',
  schoolPrincipalName: 'نايف أحمد الشهري',
  images: [],
};

export const createDailyReportData = (prevData?: ReportData): ReportData => {
  return {
    ...(prevData || INITIAL_REPORT_DATA),
    reportType: 'daily',
    title: prevData?.title && !prevData.title.includes('الأسبوعي') && prevData.title.trim().length > 0
      ? prevData.title
      : 'تقرير المتابعة الإدارية والميدانية اليومي',
    observations:
      prevData?.observations && prevData.observations.length > 0 && prevData.reportType === 'daily'
        ? prevData.observations
        : INITIAL_REPORT_DATA.observations,
    selectedDomains:
      prevData?.selectedDomains && prevData.selectedDomains.length > 0 && prevData.reportType === 'daily'
        ? prevData.selectedDomains
        : ['أمن وسلامة', 'جولة ميدانية', 'نظافة'],
  };
};

export const createWeeklyReportData = (prevData?: ReportData): ReportData => {
  return {
    ...(prevData || INITIAL_REPORT_DATA),
    reportType: 'weekly',
    title: prevData?.title && prevData.title.trim().length > 0 && !prevData.title.includes('جولة')
      ? prevData.title
      : 'التقرير الأسبوعي الشامل للشؤون المدرسية والميدانية (جميع البنود)',
    weekNumber: prevData?.weekNumber || 'الخامس',
    weekDateRange: prevData?.weekDateRange || 'من يوم الأحد إلى يوم الخميس',
    semester: prevData?.semester || 'الفصل الدراسي الأول',
    selectedDomains: [...REPORT_DOMAINS],
    domainDetails: prevData?.domainDetails || 'متابعة شاملة لكافة مرافق وتجهيزات المدرسة والعمليات الميدانية خلال الأسبوع',
    observations: WEEKLY_STANDARD_ITEMS.map((item) => ({
      id: item.id,
      description: item.description,
      status: item.status,
    })),
    recommendations:
      prevData?.recommendations && prevData.recommendations.trim().length > 0
        ? prevData.recommendations
        : '• استمرار المتابعة اليومية لجاهزية وسائل السلامة ومخارج الطوارئ لضمان أمان الطلاب.\n• التأكيد على سرعة استكمال أي بلاغات صيانة مفتوحة في منصة الصيانة.\n• متابعة نظافة الفصول والمرافق الصحية دورياً طوال ساعات اليوم الدراسي.\n• تثمين جهود الكادر الإداري في الانضباط ومتابعة مهام العمل بكفاءة.',
  };
};
