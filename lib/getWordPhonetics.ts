interface Response {
  word: string;
  phonetic: string;
  phonetics: {
    text: string;
    audio?: string;
    sourceUrl?: string;
    license?: {
      name: string;
      url: string;
    };
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms?: string[];
    antonyms?: string[];
  }[];
  license?: {
    name: string;
    url: string;
  };
  sourceUrls?: string[];
}

export async function getWordPhonetics(word: string) {
  try {
    const dictionaryBaseUrl = process.env.NEXT_PUBLIC_DICTIONARY_API_BASE_URL;
    const res = await fetch(`${dictionaryBaseUrl}/${word}`);
    const data = (await res.json()) as Response[];
    let audio = undefined;
    data[0]?.phonetics.forEach((phonetic) => {
      if (phonetic.audio) {
        audio = phonetic.audio;
        return;
      }
    });
    return { phonetic: data[0]?.phonetic, audio };
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}
