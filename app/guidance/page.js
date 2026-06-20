'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const STEEL = '#1e3a5f'

function Section({ title, titleHi, children }) {
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 28, marginBottom: 20 }}>
      <h2 style={{ fontSize: 19, fontWeight: 700, color: STEEL, margin: '0 0 4px' }}>{title}</h2>
      <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 18px', fontWeight: 500 }}>{titleHi}</p>
      {children}
    </div>
  )
}

function Step({ n, en, hi }) {
  return (
    <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
      <div style={{ flexShrink: 0, width: 26, height: 26, borderRadius: '50%', background: STEEL, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</div>
      <div>
        <p style={{ margin: 0, fontSize: 14, color: '#1e293b', lineHeight: 1.6 }}>{en}</p>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{hi}</p>
      </div>
    </div>
  )
}

function Helpline({ number, en, hi }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
      <div style={{ flexShrink: 0, minWidth: 64, fontSize: 20, fontWeight: 700, color: STEEL }}>{number}</div>
      <div>
        <p style={{ margin: 0, fontSize: 14, color: '#1e293b', fontWeight: 500 }}>{en}</p>
        <p style={{ margin: '2px 0 0', fontSize: 13, color: '#64748b' }}>{hi}</p>
      </div>
    </div>
  )
}

export default function GuidancePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Arial, sans-serif' }}>
      <Navbar active="Guidance" />

      {/* HEADER */}
      <div style={{ background: STEEL, padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
            What To Do If Someone Is Missing
          </h1>
          <p style={{ fontSize: 15, color: '#cbd5e1', margin: 0, lineHeight: 1.6 }}>
            अगर आपका कोई अपना लापता है — यह गाइड आपको बताती है कि तुरंत क्या करें।
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: '32px auto', padding: '0 24px' }}>

        {/* URGENT BANNER */}
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 14, color: '#9a3412', lineHeight: 1.7 }}>
            <strong>Act fast — the first 24 hours matter most.</strong> You do NOT have to wait 24 hours to report a missing person. That is a myth. The police are legally required to register your complaint immediately.
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#b45309', lineHeight: 1.7 }}>
            तुरंत कार्रवाई करें — पहले 24 घंटे सबसे ज़रूरी हैं। रिपोर्ट करने के लिए 24 घंटे रुकना ज़रूरी नहीं है — यह एक भ्रम है। पुलिस को आपकी शिकायत तुरंत दर्ज करनी होती है।
          </p>
        </div>

        {/* FIR */}
        <Section title="1. File an FIR (First Information Report)" titleHi="एफआईआर (प्रथम सूचना रिपोर्ट) दर्ज करें">
          <Step n="1"
            en="Go to the nearest police station immediately. A missing person complaint can be filed at any police station."
            hi="तुरंत नज़दीकी पुलिस स्टेशन जाएँ। लापता व्यक्ति की शिकायत किसी भी थाने में दर्ज की जा सकती है।" />
          <Step n="2"
            en="Carry a recent photograph, ID proof of the missing person (if available), and details: height, build, clothes last worn, distinguishing marks (tattoos, scars), and where/when last seen."
            hi="एक हाल की फ़ोटो, पहचान पत्र (अगर हो), और विवरण लाएँ: कद, शरीर, आख़िरी बार पहने कपड़े, पहचान के निशान (टैटू, निशान), और कहाँ/कब आख़िरी बार देखा गया।" />
          <Step n="3"
            en="Insist the police register the FIR and give you a copy with the FIR number. This copy is your legal record — keep it safe."
            hi="ज़ोर दें कि पुलिस एफआईआर दर्ज करे और आपको एफआईआर नंबर के साथ एक कॉपी दे। यह कॉपी आपका कानूनी रिकॉर्ड है — इसे संभालकर रखें।" />
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginTop: 6 }}>
            <p style={{ margin: 0, fontSize: 13, color: '#15803d', lineHeight: 1.7 }}>
              Tip: For a missing child or woman, the police MUST register the FIR and begin investigation right away (Supreme Court directive).<br />
              <span style={{ color: '#16a34a' }}>सुझाव: बच्चे या महिला के लापता होने पर पुलिस को तुरंत एफआईआर दर्ज करनी ही होगी (सुप्रीम कोर्ट का निर्देश)।</span>
            </p>
          </div>
        </Section>

        {/* ZERO FIR */}
        <Section title="2. If Police Refuse — Use Zero FIR" titleHi="अगर पुलिस मना करे — ज़ीरो एफआईआर का इस्तेमाल करें">
          <p style={{ fontSize: 14, color: '#1e293b', lineHeight: 1.7, margin: '0 0 12px' }}>
            If a police station says &quot;this is not our area&quot; and refuses, you have the right to file a <strong>Zero FIR</strong> — any police station must register it regardless of jurisdiction, then transfer it to the correct station.
          </p>
          <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, margin: 0 }}>
            अगर थाना कहे &quot;यह हमारा क्षेत्र नहीं है&quot; और मना करे, तो आपको <strong>ज़ीरो एफआईआर</strong> दर्ज कराने का अधिकार है — कोई भी थाना इसे दर्ज करने के लिए बाध्य है, चाहे क्षेत्र कोई भी हो। बाद में वह सही थाने को भेज देगा।
          </p>
        </Section>

        {/* HELPLINES */}
        <Section title="3. Emergency Helplines" titleHi="आपातकालीन हेल्पलाइन नंबर">
          <Helpline number="112" en="National emergency number (police, ambulance, fire)" hi="राष्ट्रीय आपातकालीन नंबर (पुलिस, एम्बुलेंस, अग्निशमन)" />
          <Helpline number="1094" en="Missing persons helpline" hi="लापता व्यक्ति हेल्पलाइन" />
          <Helpline number="1098" en="Childline — for missing or distressed children" hi="चाइल्डलाइन — लापता या संकटग्रस्त बच्चों के लिए" />
          <Helpline number="181" en="Women's helpline" hi="महिला हेल्पलाइन" />
          <Helpline number="100" en="Police control room" hi="पुलिस कंट्रोल रूम" />
        </Section>

        {/* IF POLICE INACTIVE */}
        <Section title="4. If Police Don't Act" titleHi="अगर पुलिस कार्रवाई न करे">
          <Step n="1"
            en="Escalate in writing to the Superintendent of Police (SP) or Deputy Commissioner (DCP) of your district. Keep a copy of your letter."
            hi="लिखित में ज़िले के पुलिस अधीक्षक (SP) या उपायुक्त (DCP) को शिकायत करें। अपने पत्र की कॉपी रखें।" />
          <Step n="2"
            en="File an online complaint on your State Police website, or the national portal at digitalpolice.gov.in."
            hi="अपने राज्य पुलिस की वेबसाइट पर, या राष्ट्रीय पोर्टल digitalpolice.gov.in पर ऑनलाइन शिकायत दर्ज करें।" />
          <Step n="3"
            en="File an RTI (Right to Information) to ask about the status of the investigation — this often pushes the case forward."
            hi="जाँच की स्थिति जानने के लिए RTI (सूचना का अधिकार) दाखिल करें — इससे अक्सर मामला आगे बढ़ता है।" />
          <Step n="4"
            en="As a last resort, file a Habeas Corpus petition in the High Court, which directs the police to produce the missing person."
            hi="अंतिम उपाय के रूप में, हाई कोर्ट में बंदी प्रत्यक्षीकरण (Habeas Corpus) याचिका दाखिल करें, जो पुलिस को लापता व्यक्ति को पेश करने का निर्देश देती है।" />
        </Section>

        {/* OTHER STEPS */}
        <Section title="5. Other Important Steps" titleHi="अन्य ज़रूरी कदम">
          <Step n="1"
            en="Check nearby hospitals, shelters, and railway/bus stations. Share recent photos with staff."
            hi="नज़दीकी अस्पताल, आश्रय गृह, और रेलवे/बस स्टेशन में पता करें। स्टाफ़ के साथ हाल की फ़ोटो साझा करें।" />
          <Step n="2"
            en="Register the case on JSKMU so it can be matched against unidentified records across India, and create an awareness poster to share."
            hi="JSKMU पर मामला दर्ज करें ताकि पूरे भारत के अज्ञात रिकॉर्ड से मिलान हो सके, और साझा करने के लिए एक जागरूकता पोस्टर बनाएँ।" />
          <Step n="3"
            en="Also check ZIPNET (zipnet.in) — a police database of missing persons and unidentified bodies for northern states."
            hi="ZIPNET (zipnet.in) भी देखें — उत्तरी राज्यों के लापता व्यक्तियों और अज्ञात शवों का पुलिस डेटाबेस।" />
          <Step n="4"
            en="Share on social media and local community groups — public awareness leads to many recoveries."
            hi="सोशल मीडिया और स्थानीय समुदाय समूहों में साझा करें — जन-जागरूकता से कई लोग मिल जाते हैं।" />
        </Section>

        {/* CTA */}
        <div style={{ background: STEEL, borderRadius: 12, padding: 28, textAlign: 'center', marginTop: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Register a Missing Person on JSKMU</h2>
          <p style={{ fontSize: 14, color: '#cbd5e1', margin: '0 0 18px', lineHeight: 1.6 }}>
            Free for a limited time. Your report is matched against unidentified records across India.<br />
            सीमित समय के लिए मुफ़्त। आपकी रिपोर्ट पूरे भारत के अज्ञात रिकॉर्ड से मिलाई जाती है।
          </p>
          <a href="/register" style={{ display: 'inline-block', padding: '12px 32px', background: '#fff', color: STEEL, borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 700 }}>
            Register Now →
          </a>
        </div>

        {/* DISCLAIMER */}
        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 1.7, margin: '24px 0 0' }}>
          This information is for general guidance only and is not legal advice. Procedures may vary by state. For specific legal help, consult a lawyer or legal aid service.<br />
          यह जानकारी केवल सामान्य मार्गदर्शन के लिए है, कानूनी सलाह नहीं। प्रक्रियाएँ राज्य के अनुसार भिन्न हो सकती हैं।
        </p>

      </div>

      <Footer />
    </main>
  )
}