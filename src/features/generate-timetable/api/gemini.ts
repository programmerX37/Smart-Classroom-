

import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ScheduleItem, DayOfWeek } from '../../../entities/schedule';
import { Resource } from '../../../entities/resource';
import { MOCK_SUBJECTS, DAYS_OF_WEEK } from '../../../shared/config';


// Ensure you have the API_KEY in your environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to handle this more gracefully.
  // For this context, we will proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generateColor = () => {
    const colors = ['bg-blue-200', 'bg-indigo-200', 'bg-purple-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-teal-200'];
    return colors[Math.floor(Math.random() * colors.length)];
}

const withRetry = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
    try {
        return await fn();
    } catch (error: any) {
        if (retries > 0) {
            const errorMessage = error.message || '';
            // Retry on generic network errors or server-side issues
            if (errorMessage.includes('500') || errorMessage.includes('Rpc failed') || errorMessage.includes('NetworkError')) {
                console.warn(`API call failed, retrying in ${delay}ms... (${retries} retries left)`);
                await new Promise(res => setTimeout(res, delay));
                return withRetry(fn, retries - 1, delay * 2); // Exponential backoff
            }
        }
        // Re-throw if no retries left or not a retriable error
        console.error("API call failed after retries:", error);
        if (error.message.includes("API key not valid")) {
             throw new Error("The provided API Key is not valid. Please check your configuration.");
        }
        throw new Error(`AI service failed: ${error.message}`);
    }
};


export const processAdminCommand = async (command: string): Promise<any[]> => {
  if (!API_KEY) throw new Error("Gemini API key is not configured.");
  
  const systemInstruction = `You are a powerful AI orchestrator for school administration. Your task is to interpret a user's natural language command and convert it into a structured JSON array of discrete actions. You must break down complex requests into multiple individual actions.

  Supported actions are:
  - 'create_department': { "action": "create_department", "name": "Department Name" }. You MUST provide the 'name'.
  - 'add_teaching_staff': { "action": "add_teaching_staff", "departmentName": "Department Name", "staffName": "Staff Name" }. You MUST provide both 'departmentName' and 'staffName'.
  - 'create_room': { "action": "create_room", "name": "Room Name", "capacity": 30 }. You MUST provide the 'name'. 'capacity' is an optional integer.
  - 'create_student_group': { "action": "create_student_group", "name": "Group Name" }. You MUST provide the 'name'.
  - 'set_constraint': { "action": "set_constraint", "detail": "A specific rule for the timetable, e.g., 'class duration is 50 minutes' or 'teacher Prinkya takes 5 classes'" }. You MUST provide the 'detail'.

  Return an empty array if the command is unclear. For a command like "Create a science lab with capacity for 25 students and add Mr. Fitz to the Science department", you must return two actions: one to create the room with capacity, and one to add the teacher to the department.`;

  try {
    // FIX: Add explicit type to the response from generateContent.
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: command,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING },
              name: { type: Type.STRING },
              departmentName: { type: Type.STRING },
              staffName: { type: Type.STRING },
              detail: { type: Type.STRING },
              capacity: { type: Type.INTEGER },
            },
            required: ["action"],
          }
        },
      },
    }));
    try {
        return JSON.parse(response.text.trim());
    } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", response.text);
        throw new Error("AI assistant returned an invalid response format.");
    }
  } catch (error) {
    console.error("Error processing admin command with Gemini:", error);
    throw new Error(`AI assistant failed to process the command. Reason: ${error instanceof Error ? error.message : String(error)}`);
  }
};


export const generateTimetable = async (constraints: string, resources: Resource[], teachers: string[]): Promise<ScheduleItem[]> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured. Please ask the administrator to set it up.");
  }
  
  const roomIds = resources.filter(r => r.type === 'Room').map(r => r.id);
  const studentGroups = resources.filter(r => r.type === 'StudentGroup').map(r => r.name);

  if (studentGroups.length === 0) {
      throw new Error("Cannot generate schedule: No student groups have been created. Use the AI Command Center to add student groups first (e.g., 'create student group Grade 9').");
  }

  const systemInstruction = `
    You are an expert school timetable scheduler. Your task is to generate a conflict-free weekly class schedule based on a list of teachers, subjects, student groups, rooms, and user-defined constraints.
    
    You MUST adhere to the following rules:
    1.  The output MUST be a valid JSON array of schedule item objects.
    2.  Each object must conform to the provided JSON schema.
    3.  A teacher, student group, or room cannot be booked in two places at once.
    4.  Accurately interpret and apply all user-provided constraints. This is critical. Constraints may include specific class durations (e.g., 50 minutes), specific lunch break times (which should have no classes scheduled), and specific class loads for teachers (e.g., 'teacher X takes 5 classes'). You must calculate the endTime based on the startTime and the specified duration. If no duration is specified, assume 1 hour.
    5.  Ensure all IDs are unique strings.
    6.  The day must be one of: ${DAYS_OF_WEEK.join(', ')}.
    7.  The studentGroup must be one of: ${studentGroups.join(', ')}.
    8.  The teacher must be one of: ${teachers.join(', ')}.
    9.  The subject must be one of: ${MOCK_SUBJECTS.join(', ')}.
    10. The roomId must be one of: ${roomIds.join(', ')}.
  `;

  const prompt = `
    Generate a schedule based on the following constraints:
    ---
    ${constraints}
    ---
  `;

  try {
    const response: GenerateContentResponse = await withRetry(() => ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "A unique identifier for the schedule item." },
              subject: { type: Type.STRING, description: "The subject of the class." },
              teacher: { type: Type.STRING, description: "The name of the teacher." },
              studentGroup: { type: Type.STRING, description: "The student group attending." },
              roomId: { type: Type.STRING, description: "The ID of the room." },
              day: { type: Type.STRING, description: "The day of the week." },
              startTime: { type: Type.STRING, description: "The start time in HH:MM format." },
              endTime: { type: Type.STRING, description: "The end time in HH:MM format." },
            },
            required: ["id", "subject", "teacher", "studentGroup", "roomId", "day", "startTime", "endTime"]
          },
        },
      },
    }));

    let generatedSchedule: Omit<ScheduleItem, 'color'>[];
    try {
        const jsonText = response.text.trim();
        generatedSchedule = JSON.parse(jsonText);
    } catch(parseError) {
        console.error("Failed to parse timetable JSON from Gemini:", response.text);
        throw new Error("The AI generated an invalid timetable format. Please try refining your constraints.");
    }
    

    // Add a random color to each item for better visualization
    return generatedSchedule.map(item => ({
        ...item,
        day: item.day as DayOfWeek, // Cast to DayOfWeek type
        color: generateColor(),
    }));

  } catch (error) {
    console.error("Error generating timetable with Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while contacting the AI service.";
    throw new Error(`Failed to generate timetable. Reason: ${errorMessage}`);
  }
};