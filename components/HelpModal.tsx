import React, { useState } from 'react';
import { XIcon } from './Icons';
import { MathJax } from 'better-react-mathjax';

const guideContent = {
    fr: {
        title: "Guide d'Utilisation de la Plateforme Sigma",
        sections: [
            {
                title: "1. Navigation Principale",
                content: `<p>La navigation est simple et hiérarchique :</p>
                          <ul>
                            <li><strong>Accueil :</strong> Vous choisissez votre classe (ex: Seconde).</li>
                            <li><strong>Chapitres :</strong> Après avoir choisi une classe, vous voyez la liste des chapitres disponibles.</li>
                            <li><strong>Exercices :</strong> En sélectionnant un chapitre, vous accédez à la liste des exercices.</li>
                          </ul>
                          <p>Utilisez le fil d'Ariane (ex: Accueil > Seconde) en haut de la page pour revenir facilement aux étapes précédentes.</p>`
            },
            {
                title: "2. Résoudre un Exercice",
                content: `<p>L'écran d'un exercice est divisé en deux parties principales :</p>
                          <div class="my-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                            <h4 class="font-semibold text-slate-700">À gauche : L'Énoncé</h4>
                            <p class="text-sm mt-1">Lisez l'énoncé de l'exercice. Certaines questions dans les listes numérotées sont <strong>interactives</strong>. Cliquez dessus pour que la vidéo de correction se lance directement au bon moment !</p>
                          </div>
                          <div class="my-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                            <h4 class="font-semibold text-slate-700">À droite : Les Outils</h4>
                            <p class="text-sm mt-1">Trois onglets sont à votre disposition :</p>
                            <ul class="text-sm list-disc pl-5 mt-2">
                                <li><strong>Correction Vidéo :</strong> La vidéo explicative de l'exercice.</li>
                                <li><strong>Rappel de cours :</strong> Les formules et théorèmes essentiels pour résoudre l'exercice.</li>
                                <li><strong>Quiz :</strong> Un petit test rapide pour vérifier que vous avez bien compris la leçon.</li>
                            </ul>
                          </div>`
            },
            {
                title: "3. Mode Administration (Accès Restreint)",
                content: `<p>L'icône d'engrenage <span class="inline-block align-middle">⚙️</span> en bas à droite vous donne accès au panneau d'administration (protégé par un code).</p>
                          <p>Ce panneau vous permet de :</p>
                          <ul class="list-disc pl-5">
                            <li>Ajouter, modifier ou supprimer des classes, chapitres et exercices.</li>
                            <li>Éditer le contenu de chaque exercice (énoncé, vidéo, rappel de cours).</li>
                            <li>Importer des exercices en masse via un fichier JSON. Un guide de formatage est disponible dans le projet.</li>
                          </ul>`
            }
        ]
    },
    ar: {
        title: "دليل استخدام منصة سيجما",
        sections: [
            {
                title: "1. التنقل الرئيسي",
                content: `<p>التنقل بسيط وهرمي:</p>
                          <ul>
                            <li><strong>الصفحة الرئيسية:</strong> تختار صفك الدراسي (مثال: السنة الثانية).</li>
                            <li><strong>الفصول:</strong> بعد اختيار الصف، سترى قائمة الفصول المتاحة.</li>
                            <li><strong>التمارين:</strong> باختيار فصل، تصل إلى قائمة التمارين.</li>
                          </ul>
                          <p>استخدم شريط التنقل (مثال: الرئيسية > السنة الثانية) في أعلى الصفحة للعودة بسهولة إلى الخطوات السابقة.</p>`
            },
            {
                title: "2. حل تمرين",
                content: `<p>شاشة التمرين مقسمة إلى قسمين رئيسيين:</p>
                          <div class="my-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                            <h4 class="font-semibold text-slate-700">على اليمين: نص التمرين</h4>
                            <p class="text-sm mt-1">اقرأ نص التمرين. بعض الأسئلة في القوائم المرقمة <strong>تفاعلية</strong>. انقر عليها ليبدأ فيديو الشرح مباشرة في اللحظة المناسبة!</p>
                          </div>
                          <div class="my-4 p-3 bg-slate-100 rounded-md border border-slate-200">
                            <h4 class="font-semibold text-slate-700">على اليسار: الأدوات</h4>
                            <p class="text-sm mt-1">ثلاث علامات تبويب تحت تصرفك:</p>
                            <ul class="text-sm list-disc pr-5 mt-2">
                                <li><strong>تصحيح بالفيديو:</strong> الفيديو التوضيحي للتمرين.</li>
                                <li><strong>تذكير بالدرس:</strong> الصيغ والنظريات الأساسية اللازمة لحل التمرين.</li>
                                <li><strong>اختبار قصير:</strong> اختبار سريع للتحقق من فهمك للدرس.</li>
                            </ul>
                          </div>`
            },
            {
                title: "3. وضع الإدارة (وصول مقيد)",
                content: `<p>أيقونة الترس <span class="inline-block align-middle">⚙️</span> في أسفل اليمين تتيح لك الوصول إلى لوحة الإدارة (محمية برمز).</p>
                          <p>تتيح لك هذه اللوحة:</p>
                          <ul class="list-disc pr-5">
                            <li>إضافة أو تعديل أو حذف الصفوف والفصول والتمارين.</li>
                            <li>تحرير محتوى كل تمرين (النص، الفيديو، تذكير الدرس).</li>
                            <li>استيراد التمارين بشكل جماعي عبر ملف JSON. دليل التنسيق متاح في المشروع.</li>
                          </ul>`
            }
        ]
    }
};

const HelpModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
    const content = guideContent[language];

    const LangButton: React.FC<{ lang: 'fr' | 'ar', children: React.ReactNode }> = ({ lang, children }) => (
        <button
            onClick={() => setLanguage(lang)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${language === lang ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white w-full max-w-3xl h-[90vh] max-h-[700px] rounded-xl shadow-2xl flex flex-col transform transition-all animate-fade-in-up-fast" onClick={e => e.stopPropagation()}>
                <header className="p-4 flex justify-between items-center border-b border-slate-200 flex-shrink-0">
                    <h2 className={`text-xl font-bold text-slate-800 ${language === 'ar' ? 'font-arabic' : ''}`}>
                        {content.title}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                            <LangButton lang="fr">Français</LangButton>
                            <LangButton lang="ar">العربية</LangButton>
                        </div>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                            <XIcon className="w-6 h-6" />
                        </button>
                    </div>
                </header>

                <main className="flex-grow p-6 overflow-y-auto" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className={`prose max-w-none ${language === 'ar' ? 'font-arabic' : ''}`}>
                        <MathJax dynamic>
                            {content.sections.map((section, index) => (
                                <section key={index} className="mb-6">
                                    <h3 className="text-lg font-semibold border-b border-slate-200 pb-2 mb-3">{section.title}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                </section>
                            ))}
                        </MathJax>
                    </div>
                </main>
                 <footer className="p-3 text-center border-t border-slate-200 bg-slate-50 flex-shrink-0">
                    <p className="text-xs text-slate-500">Sigma Learning Platform - Guide Utilisateur</p>
                </footer>
            </div>
        </div>
    );
};

export default HelpModal;