"use client";

import { model } from "@/lib/gemini";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import SubmitBtn from "./SubmitBtn";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { getWordPhonetics } from "@/lib/getWordPhonetics";
// import { res1 } from "@/lib/testResults";
import PronounceWordBtn from "./PronounceWordBtn";
import SpeechToTextBtn from "./SpeechToTextBtn";

interface SuggestedWord {
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  phonetic?: string;
  audio?: string;
}

// const mockWords = [
//   {
//     word: "eloquent",
//     meaning: "marked by forceful and fluent expression",
//     example: "an eloquent preacher",
//   },
//   {
//     word: "articulate",
//     meaning: "expressing oneself readily, clearly, and effectively",
//     example: "an articulate teacher",
//   },
//   {
//     word: "verbose",
//     meaning: "containing more words than necessary",
//     example: "a verbose reply",
//   },
//   {
//     word: "loquacious",
//     meaning: "full of excessive talk: WORDY",
//     example: "the loquacious host of a radio talk show",
//   },
// ];

const suggestedWordsVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      // duration: 2,
      staggerChildren: 0.2,
    },
  },
};

const wordVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { ease: "easeIn" } },
};

export default function Card() {
  const [words, setWords] = useState<SuggestedWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<SuggestedWord | null>(null);
  const [loadingPhonetics, setLoadingPhonetics] = useState(false);

  // const mockApi = async (formData: FormData) => {
  //   try {
  //     const prompt = formData.get("prompt-input");
  //     if (!prompt) {
  //       toast.error("Please enter a prompt!", {
  //         position: "top-center",
  //         className: "font-[inherit] text-sm",
  //       });
  //       return;
  //     }
  //     const res = new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //         resolve(mockWords.map((word) => word.word));
  //       }, 1000);
  //     });
  //     res.then((data) => {
  //       setWords(data as string[]);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const findSuggestions = async (formData: FormData) => {
    try {
      setWords([]);
      const prompt = formData.get("prompt-input") as string;
      if (!prompt?.trim()) {
        toast.error("Please enter a prompt!", {
          position: "top-center",
          className: "font-[family-name:--font-geist-sans] text-sm",
        });
        return;
      }
      const result = await model.generateContent(prompt as string);
      const response = result.response;
      const text = response.text();
      // console.log(text);
      const formattedWords = formatJsonString(text);
      if (formattedWords) setWords(formattedWords);
    } catch (error) {
      console.error(error);
    }
  };

  const formatJsonString = (jsonString: string) => {
    // console.log(jsonString);
    try {
      const invalidPrompt =
        "Invalid prompt, please describe the word you are looking for.\n";
      if (jsonString === invalidPrompt) {
        toast.error(invalidPrompt, {
          position: "top-center",
          className: "font-[family-name:--font-geist-sans] text-sm",
        });
        return null;
      }
      // Remove the ```json and ``` markers and any leading/trailing whitespace
      const cleanedString = jsonString.replace(/```json|```/g, "").trim();

      // Parse the cleaned string into a JavaScript object
      const parsedObject = JSON.parse(cleanedString) as SuggestedWord[];

      // console.log(parsedObject);

      return parsedObject;
    } catch (error) {
      console.error("Error parsing JSON string:", error);
      return null;
    }
  };

  const handleSelectedWord = async (word: SuggestedWord) => {
    try {
      setSelectedWord(word);
      setLoadingPhonetics(true);
      const { phonetic, audio } = await getWordPhonetics(word.word);
      setSelectedWord({ ...word, phonetic, audio });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPhonetics(false);
    }
  };

  return (
    <main className="bg-white w-full max-w-lg min-h-96 rounded-lg shadow-md p-4">
      {/* <button
        className="w-fit px-3 py-2 text-sm font-normal"
        onClick={() => formatJsonString(res1)}
      >
        clear
      </button> */}
      <h1 className="font-bold text-2xl text-center my-4">WordSeeker</h1>
      <p className="font-normal text-base text-gray-500 text-center">
        Describe the word you&apos;re looking for, and we&apos;ll suggest{" "}
        <br className="hidden md:block" />
        matches!
      </p>
      <form action={findSuggestions} className="mt-9 text-sm font-normal">
        <div className="relative w-full h-36">
          <textarea
            // type="text"
            name="prompt-input"
            className="w-full h-full resize-none border border-gray-300 rounded-lg p-3 outline-none text-inherit focus:border-2 focus:border-gray-400 transition duration-300 ease-linear"
            placeholder={`Start with something like "what's the word for..."`}
          ></textarea>
          <SpeechToTextBtn />
        </div>
        <SubmitBtn />
      </form>
      {words.length > 0 && (
        <div className="grid grid-rows-[0fr] transition-all duration-300 ease-in">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-semibold text-xl mt-5"
          >
            Suggested Words:
          </motion.h2>
          <motion.div
            variants={suggestedWordsVariants}
            initial="hidden"
            animate="visible"
            className="my-3 flex items-center gap-4 flex-wrap text-sm font-normal"
          >
            {words.map((word) => (
              <motion.span
                variants={wordVariants}
                key={word.word}
                className="bg-[#dbeafe] text-[#4f40b6] rounded-[99px] px-2 py-1 cursor-pointer"
                onClick={() => handleSelectedWord(word)}
              >
                {word.word}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
      <Dialog
        open={selectedWord !== null}
        onOpenChange={() => setSelectedWord(null)}
      >
        <DialogContent className="font-[family-name:var(--font-geist-sans)]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <p className="text-2xl">{selectedWord?.word}</p>
              {loadingPhonetics ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <span className="text-base font-normal">
                    {selectedWord?.phonetic}
                  </span>
                  {selectedWord?.audio && (
                    <div className="border border-gray-800 p-1 rounded-full cursor-pointer">
                      <PronounceWordBtn src={selectedWord.audio} />
                    </div>
                  )}
                </>
              )}
            </DialogTitle>
            <DialogDescription>noun</DialogDescription>
          </DialogHeader>
          <div>
            <h4 className="font-semibold">Definition:</h4>
            <p className="text-sm">{selectedWord?.definition}</p>
          </div>
          <div className="my-2">
            <h4 className="font-semibold">Example:</h4>
            <p className="text-sm">
              <em>{selectedWord?.example}</em>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

//446 * 354
