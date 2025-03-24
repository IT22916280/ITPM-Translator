const fetchTranslation = async (text, fromLang, toLang) => {
    const apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${fromLang}|${toLang}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data.responseData.translatedText || "";
    } catch (error) {
      console.error("Error fetching translation:", error);
      return "";
    }
  };
  
  export { fetchTranslation };
  