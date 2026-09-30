import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_BASE_URL, API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponsePreview from "./components/AiResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

const InterviewPrep = () => {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [streamedText, setStreamedText] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateLoader, setIsUpdateLoader] = useState(false);

  // Fetch session data by session id
  const fetchSessionDetailsById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (err) {
      console.log("Error : ", err);
    }
  };

  // Generate Concept Explanation with streaming
  const generateConceptExplanation = async (question) => {
    // Reset all state for a fresh request
    setErrorMsg("");
    setExplanation(null);
    setStreamedText("");
    setStreamTitle("");
    setIsLoading(true);
    setIsStreaming(false);
    setOpenLeanMoreDrawer(true);

    try {
      const setFinalExplanation = (content, fallbackTitle = "Explanation") => {
        const normalizedContent = String(content || "").trim();
        const titleMatch = normalizedContent.match(/^\s*#\s+([^\r\n]+)\s*/);
        const title = titleMatch ? titleMatch[1].trim() : fallbackTitle;
        const body = titleMatch
          ? normalizedContent.slice(titleMatch[0].length).trim()
          : normalizedContent;

        if (!body) {
          setErrorMsg("The explanation response was empty. Try again later.");
          return false;
        }

        setStreamTitle(title);
        setExplanation({ title, explanation: body });
        return true;
      };

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}${API_PATHS.AI.GENERATE_EXPLANATION}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({ question }),
        }
      );

      if (!response.ok || !response.body) {
        let serverMessage = "Failed to connect to the server.";
        try {
          const errorData = await response.json();
          serverMessage = errorData?.message || errorData?.error || serverMessage;
        } catch {
          // Keep the connection error when the server did not return JSON.
        }
        throw new Error(serverMessage);
      }

      const contentType = response.headers.get("Content-Type") || "";
      console.log("[STREAM] Response Content-Type:", contentType);

      // ── Fallback: old backend returns plain JSON (not yet redeployed) ──
      if (contentType.includes("application/json")) {
        console.log("[STREAM] Non-SSE response detected. Reading as JSON.");
        const data = await response.json();
        const content =
          typeof data === "string"
            ? data
            : data?.explanation || data?.text || data?.message;
        setFinalExplanation(content, data?.title);
        setIsLoading(false);
        setIsStreaming(false);
        return;
      }

      // ── SSE streaming path (new backend) ──
      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";

      setIsLoading(false);
      setIsStreaming(true);

      while (true) {
        const { value, done } = await reader.read();

        // Decode whatever we have (including final flush on done)
        if (value) {
          buffer += decoder.decode(value, { stream: !done });
        }

        // Process all complete SSE messages in the buffer
        const messages = buffer.split(/\r?\n\r?\n/);
        // If not done, keep the last potentially incomplete message in the buffer
        // If done, process everything (no more data is coming)
        buffer = done ? "" : (messages.pop() ?? "");

        for (const message of messages) {
          const trimmed = message.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr) continue;

          console.log("[SSE] Raw message received:", jsonStr.slice(0, 80));

          try {
            const parsed = JSON.parse(jsonStr);

            if (parsed.error) {
              console.error("[SSE] Server error:", parsed.error);
              setErrorMsg("Failed to generate explanation. Please try again.");
              setIsStreaming(false);
              return;
            }

            if (parsed.done) {
              console.log("[SSE] Stream complete. Total length:", accumulatedText.length);
              setFinalExplanation(accumulatedText);
              setIsStreaming(false);
              return;
            }

            if (parsed.chunk) {
              accumulatedText += parsed.chunk;
              // flushSync forces React to paint immediately after each chunk
              // — bypasses React 18 batching so text appears word-by-word
              flushSync(() => {
                setStreamedText((prev) => prev + parsed.chunk);
              });
            }
          } catch (e) {
            console.warn("[SSE] Failed to parse message:", jsonStr, e);
          }
        }

        if (done) break;
      }

      // Fallback: stream ended without a {done:true} event — finalize with what we have
      if (accumulatedText) {
        console.log("[SSE] Stream ended without done event. Finalizing from buffer.");
        setFinalExplanation(accumulatedText);
      } else {
        setErrorMsg("Failed to generate explanation. Try again later.");
      }
      setIsStreaming(false);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setIsStreaming(false);
      setErrorMsg(err.message || "Failed to generate explanation. Try again later.");
      console.error("Streaming error:", err);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance(API_PATHS.QUESTION.PIN(questionId));

      if (response.data && response.data.question) {
        fetchSessionDetailsById();
      }
    } catch (err) {
      console.error("Error : ", err);
    }
  };

  const uploadMoreQuestions = async () => {
    try{
         setIsUpdateLoader(true);

         const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if(response.data){
        toast.success("Added more Q&A!!");
        fetchSessionDetailsById();
      }

    }catch(err){
        if(err.response && err.response.data.message){
             setErrorMsg(err.response.data.message);
        }
        else{
          setErrorMsg("Something went wrong, please try again.")
        }
    }finally {
      setIsUpdateLoader(false);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetailsById();
    }
    return () => {};
  }, []);

  // Return JSX
  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "--"}
        questions={sessionData?.questions?.length || "--"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />
      <div className="container mx-auto pt-8 pb-4 px-10">
        <h2 className="text-xl font-semibold text-white">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout // This helps animate position changes
                    layoutId={`question-${data._id || index}`} // Helps Framer track position
                  >
                    <QuestionCard
                      question={data?.question}
                      queNumber={index}
                      answer={data?.answer}
                      onLearnMore={() =>
                        generateConceptExplanation(data.question)
                      }
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />
                    {!isLoading &&
                      sessionData?.questions?.length == index + 1 && (
                        <div className="flex items-center justify-center mt-5">
                          <button
                            className="flex items-center gap-3 text-sm font-medium text-white bg-sky-400 px-5 py-2 mr-2 rounded text-nowrap cursor-pointer hover:bg-sky-300 transition-colors"
                            disabled={isLoading || isUpdateLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdateLoader ? (
                              <SpinnerLoader />
                            ) : (
                              <LuListCollapse className="text-lg" />
                            )}{" "}
                            Load More
                          </button>
                        </div>
                      )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <Drawer
            isOpen={openLeanMoreDrawer}
            onClose={() => setOpenLeanMoreDrawer(false)}
            title={
              streamTitle ||
              (!isLoading && !isStreaming && explanation?.title) ||
              ""
            }
          >
            {errorMsg && (
              <p className="flex gap-2 text-sm text-amber-600 font-medium">
                <LuCircleAlert className="mt-1"></LuCircleAlert>
                {errorMsg}
              </p>
            )}

            {/* Loading indicator: only shown while waiting for the stream to begin */}
            {isLoading && (
              <div className="p-4 text-gray-500 animate-pulse">
                Thinking...
              </div>
            )}

            {/* Live streaming view: render as soon as streaming begins */}
            {isStreaming && streamedText && (
              <AIResponsePreview content={streamedText} />
            )}

            {/* Final completed view */}
            {!isLoading && !isStreaming && explanation && (
              <AIResponsePreview content={explanation?.explanation} />
            )}
          </Drawer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InterviewPrep;
