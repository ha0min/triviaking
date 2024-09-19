'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Square, Play, RotateCcw, Bookmark, Check } from "lucide-react";

interface QuestionData {
  ch_question: string;
  question: string;
  tag: string;
  frequency: string;
  finished: boolean;
  marked: boolean;
  id: number;
}

const mockData: QuestionData = {
  ch_question: "HTTP1.0和HTTP1.1的区别",
  question: "Differences between HTTP1.0 and HTTP1.1",
  tag: "Computer Networks",
  frequency: "High",
  finished: false,
  marked: false,
  id: 8
};

enum RecordingState {
  Initial,
  Recording,
  Recorded
}

const InterviewQuestionCard = (
  { data }: { data: QuestionData }
) => {
  const [recordingState, setRecordingState] = useState<RecordingState>(RecordingState.Initial);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isMarked, setIsMarked] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (recordingState === RecordingState.Recording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [recordingState]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingState(RecordingState.Recording);
      setRecordingTime(0);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingState(RecordingState.Recorded);
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  }, [audioURL]);

  const resetRecording = useCallback(() => {
    setRecordingState(RecordingState.Initial);
    setRecordingTime(0);
    setAudioBlob(null);
    setAudioURL(null);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMark = () => {
    setIsMarked(!isMarked);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-2xl font-bold">
          <span className="mr-2">{mockData.question}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMark}
            className={`${isMarked ? 'text-yellow-500' : 'text-gray-500'}`}
          >
            <Bookmark className="h-6 w-6" />
          </Button>
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">{mockData.tag}</Badge>
          <Badge variant="outline">Frequency: {mockData.frequency}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">{mockData.ch_question}</p>
        {recordingState === RecordingState.Recording && (
          <p className="text-sm text-red-500">Recording: {formatTime(recordingTime)}</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        {recordingState === RecordingState.Initial && (
          <Button className="w-full" onClick={startRecording}>
            <Mic className="mr-2 h-4 w-4" /> Start Recording
          </Button>
        )}
        {recordingState === RecordingState.Recording && (
          <Button variant="destructive" className="w-full" onClick={stopRecording}>
            <Square className="mr-2 h-4 w-4" /> Stop Recording
          </Button>
        )}
        {recordingState === RecordingState.Recorded && (
          <div className="flex flex-col gap-2 w-full">
            <Button className="w-full" onClick={playRecording}>
              <Play className="mr-2 h-4 w-4" /> Play Recording
            </Button>
            <Button variant="outline" className="w-full" onClick={resetRecording}>
              <RotateCcw className="mr-2 h-4 w-4" /> Redo Recording
            </Button>

            <Button className="w-full" onClick={markQuestionFinished(data.id)}>
              <Check className="mr-2 h-4 w-4" /> Finish Recording
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default InterviewQuestionCard;