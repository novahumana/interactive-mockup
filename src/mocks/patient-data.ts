import { Patient } from "../types/types";

export const PATIENT_ID_001 = "1";
export const PATIENT_ID_002 = "2";
export const PATIENT_ID_003 = "3";
export const PATIENT_ID_004 = "4";

/** Mock data to simulate patient sessions and transcriptions */
export const patientsData: Record<string, Patient> = {
  [PATIENT_ID_001]: {
    id: PATIENT_ID_001,
    name: "Mario R.",
    patientId: "PZ-023",
    status: "active",
    aiTranscription: "enabled",
    lastSession: "2024-09-20",
    recordedSessions: 3,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.20",
        dayName: "Tuesday",
        noteCount: 2,
        transcription: {
          sessionTitle: "Session S1 - Work Anxiety & Perfectionism",
          sessionDate: "2024-09-20",
          duration: "58 min.",
          conversation: [
            {
              speaker: "therapist",
              message:
                "Hello Mario, good to see you. How have you been since we last spoke?",
            },
            {
              speaker: "patient",
              message:
                "Yeah, hi. Um, I've been... it's been a tough week, honestly. Work has been really stressful.",
            },
            {
              speaker: "therapist",
              message:
                "I'm sorry to hear that. Can you tell me a bit more about what's been happening?",
            },
            {
              speaker: "patient",
              message:
                "So, this whole thing started on Tuesday morning. I overslept. Which almost never happens to me, but I was up late working the night before, and I just... I didn't hear my alarm. By the time I woke up, I was already 20 minutes late for work.",
            },
            {
              speaker: "therapist",
              message:
                "Okay, you overslept. What happened when you got to work?",
            },
            {
              speaker: "patient",
              message:
                'Well, I rushed in, and my boss was already there. And he made, like, this comment in front of everyone. He said, "Nice of you to join us, Mario." And just... (pause) everyone heard it. My colleagues all looked at me.',
            },
            {
              speaker: "therapist",
              message:
                "That must have been uncomfortable. How did you feel in that moment?",
            },
            {
              speaker: "patient",
              message:
                "I felt... I don't know, like I wanted to disappear. My face got all hot. I felt so ashamed. It wasn't just embarrassment, it was like... like everyone was thinking I'm irresponsible, that I can't handle my job.",
            },
            {
              speaker: "therapist",
              message:
                "So the comment from your boss triggered some thoughts about what others were thinking of you?",
            },
            {
              speaker: "patient",
              message:
                "Exactly. I kept thinking things like, \"I'm a failure. Everyone here thinks I'm incompetent now.\" And the worst part is, I started thinking, \"I'm never going to be able to keep this job. They're going to fire me.\" Which is crazy because one time being late shouldn't mean that, but my mind just went there.",
            },
            {
              speaker: "therapist",
              message:
                "That does sound like your mind went to some pretty extreme conclusions. Let me ask you this - has your boss mentioned anything about your performance or job security since that comment?",
            },
            {
              speaker: "patient",
              message:
                "No, nothing. He seemed normal after that. But I couldn't shake the feeling all day. I avoided making eye contact with people at lunch. Actually, I didn't even go to lunch. I just stayed at my desk, trying to look busy.",
            },
            {
              speaker: "therapist",
              message:
                "So you isolated yourself because of the feelings you were having?",
            },
            {
              speaker: "patient",
              message:
                "Yeah. And then in the afternoon, there was a team meeting, and I usually contribute ideas and things, but I completely stayed quiet. I didn't say a word. I was terrified of saying something wrong or stupid.",
            },
            {
              speaker: "therapist",
              message:
                "I notice you said you were terrified. Can you describe what that felt like physically?",
            },
            {
              speaker: "patient",
              message:
                "My stomach felt tight, like knots. And my hands were shaking a little. I was just in my head the whole time, replaying that moment in the morning over and over again. Like, his tone, the way people looked at me. I couldn't focus on anything anyone was saying in the meeting.",
            },
            {
              speaker: "therapist",
              message:
                "That sounds really difficult. How did the rest of the week go?",
            },
            {
              speaker: "patient",
              message:
                "It got a bit better by Thursday, but I was still kind of withdrawn. And honestly, Saturday I was dreading going back to work on Monday. I'm still dreading it.",
            },
            {
              speaker: "therapist",
              message:
                "So even though it's seven days later, you're still carrying this anxiety with you. Mario, I want to pause here and reflect something back to you. Your boss made one comment, which I acknowledge was thoughtless, but since then, nothing has changed in terms of your actual job performance or your standing there, correct?",
            },
            {
              speaker: "patient",
              message:
                "(pause) Well, yeah. I mean, obviously nothing has actually changed. I'm still doing my job fine. I know that logically.",
            },
            {
              speaker: "therapist",
              message: "But emotionally, it feels like everything has changed?",
            },
            {
              speaker: "patient",
              message:
                "Yes. Exactly that. It's like my mind jumped to this conclusion that I'm going to lose my job, and even though I know that's probably not true, I can't shake the feeling.",
            },
            {
              speaker: "therapist",
              message:
                "What you're describing is what we call catastrophizing. Your mind takes one event - being late, getting a mildly critical comment - and it extrapolates that into a worst-case scenario. Does that resonate with you?",
            },
            {
              speaker: "patient",
              message:
                "Yeah, it does. I mean, I've noticed I do this a lot, actually. Not just at work, but other places too.",
            },
            {
              speaker: "therapist",
              message: "Can you give me another example?",
            },
            {
              speaker: "patient",
              message:
                "Um, like, if my partner's quiet for a bit, I immediately think, \"Oh no, I've done something wrong. She's mad at me.\" And I get all anxious until I ask her what's wrong, and usually she's just thinking about something work-related. It's exhausting, actually.",
            },
            {
              speaker: "therapist",
              message:
                "It does sound exhausting - being in that state of worry constantly. I want to explore something. When you were a teenager, did this kind of anxious thinking happen then as well?",
            },
            {
              speaker: "patient",
              message:
                "(longer pause) Yeah. Actually, a lot. My dad could be pretty critical growing up. He'd always point out what I did wrong instead of... I don't know, what I did right. And I learned pretty quickly that if I wasn't perfect, if I made mistakes, I'd get criticized.",
            },
            {
              speaker: "therapist",
              message:
                "So there's a connection here. Being criticized by your boss triggered something deeper - some old patterns from your childhood about what criticism means about you as a person.",
            },
            {
              speaker: "patient",
              message:
                "That makes sense. When he made that comment, it felt like... like I wasn't just being late, I was being a failure as a person. Because that's how my dad used to make me feel. Like one mistake meant I was fundamentally flawed.",
            },
            {
              speaker: "therapist",
              message:
                "Do you see any difference between being late to work - which is a behavior that happened once - and being a failure as a person?",
            },
            {
              speaker: "patient",
              message:
                "Of course there's a difference. I know that logically. But it doesn't feel like there's a difference when I'm in the middle of it.",
            },
            {
              speaker: "therapist",
              message:
                "Right. That gap between what you know logically and what you feel is what we can work on. Let me ask you some challenging questions. Based on the evidence from your actual job, are you incompetent?",
            },
            {
              speaker: "patient",
              message:
                "No. I get compliments on my work. I've had three promotions in the five years I've been there.",
            },
            {
              speaker: "therapist",
              message:
                "And would an incompetent person receive three promotions?",
            },
            { speaker: "patient", message: "No, of course not." },
            {
              speaker: "therapist",
              message:
                "So where's the discrepancy between the facts of your job performance and these thoughts you're having?",
            },
            {
              speaker: "patient",
              message:
                "(pause) The discrepancy is huge. I guess, when I look at it objectively, I'm actually doing really well. But when I'm feeling anxious, I completely lose perspective.",
            },
            {
              speaker: "therapist",
              message:
                "That's an important insight. And there's something else I want to point out. You said your boss seemed normal after the comment, that you haven't heard anything negative, yet you're still convinced you're going to be fired. What would change that conviction?",
            },
            {
              speaker: "patient",
              message:
                "I don't know. I guess... I guess I'd have to just see, over time, that nothing bad happens? That everything goes back to normal?",
            },
            {
              speaker: "therapist",
              message:
                "So you need the evidence of time and continued okay-ness to overcome the catastrophic thought?",
            },
            {
              speaker: "patient",
              message:
                "Yeah. But I hate waiting. I hate being in this anxious state.",
            },
            {
              speaker: "therapist",
              message:
                "I understand. And that's actually something we can work with. Let's think about some coping strategies. When you notice this catastrophic thinking starting, what do you think might help?",
            },
            {
              speaker: "patient",
              message:
                "I've tried deep breathing before, but... I'm not really consistent with it.",
            },
            {
              speaker: "therapist",
              message:
                "What about examining the thoughts? Like, challenging them? We could develop a approach for when you notice these thoughts happening. For example, instead of just accepting \"I'm going to lose my job,\" you could ask yourself: What's the evidence for this? What's the evidence against it?",
            },
            {
              speaker: "patient",
              message:
                "I suppose that could help. I'm just not sure I'll remember to do it in the moment.",
            },
            {
              speaker: "therapist",
              message:
                "That's fair. Anxiety makes it hard to remember skills when you're in the middle of it. One thing that might help is practicing these skills when you're calmer, so they become more automatic. Also, writing things down sometimes helps. You could even keep a note on your phone about questions to ask yourself when these thoughts arise.",
            },
            {
              speaker: "patient",
              message: "That might work. I could try that.",
            },
            {
              speaker: "therapist",
              message:
                "Another thing I want us to explore is the connection to your childhood. It sounds like your father's critical style created a template for how you interpret criticism now - as a reflection of your fundamental worthiness. Is that fair to say?",
            },
            {
              speaker: "patient",
              message:
                "That's pretty much it, yeah. I still feel like I need to be perfect to be okay. To be loved.",
            },
            {
              speaker: "therapist",
              message: "And how's that working for you?",
            },
            {
              speaker: "patient",
              message:
                "(laughs a little) It's not. Because obviously nobody's perfect, and I'm exhausted trying to be.",
            },
            {
              speaker: "therapist",
              message:
                "Right. So one of the longer-term things we might want to work on is loosening the connection between your performance and your self-worth. But that's a deeper piece of work that takes time.",
            },
            {
              speaker: "patient",
              message: "Okay. I can see why that would be important.",
            },
            {
              speaker: "therapist",
              message:
                "For now, let's focus on: One, raising your awareness of when these catastrophic thoughts are happening. Two, practicing some thought-challenging techniques. And three, building in some regular stress-management practices like breathing or exercise.",
            },
            { speaker: "patient", message: "Yeah, okay. I can do that." },
            {
              speaker: "therapist",
              message:
                "Good. One more question before we wrap up - when you go back to work this week, do you think you'll be able to use any of these tools?",
            },
            {
              speaker: "patient",
              message:
                "I'll try. I'm still nervous about it, but having a plan helps a bit.",
            },
            {
              speaker: "therapist",
              message:
                "That makes sense. Anxiety doesn't disappear right away, but having tools and perspective helps, and over time, the anxiety response typically decreases as you gather evidence that the catastrophic thing didn't happen.",
            },
            { speaker: "patient", message: "Okay. That gives me some hope." },
            {
              speaker: "therapist",
              message:
                "Good. I want to check in with you about your week. Aside from work, how's the rest of your life been?",
            },
            {
              speaker: "patient",
              message:
                "Pretty good, actually. My relationship is good, I'm exercising a bit, seeing friends. It's really just the work thing that's been bothering me lately.",
            },
            {
              speaker: "therapist",
              message: "So work anxiety is your primary concern right now?",
            },
            {
              speaker: "patient",
              message:
                "Yeah, pretty much. Well, and this tendency to catastrophize. The realization that I've been doing this my whole life is kind of... heavy.",
            },
            {
              speaker: "therapist",
              message:
                "That's a big realization though. Self-awareness is the first step to change. Let's make sure we schedule another appointment so we can check in on how things are going and continue with this work.",
            },
            {
              speaker: "patient",
              message: "Definitely. When should I come back?",
            },
            {
              speaker: "therapist",
              message:
                "How about next week at the same time? That way you can practice some of these tools, and we can see how it goes.",
            },
            {
              speaker: "patient",
              message:
                "Works for me. Thank you. I feel like I have more of a sense of what's happening and what I can do about it.",
            },
            {
              speaker: "therapist",
              message:
                "Good. That's what I'm here for. We'll take it one step at a time. See you next week, Mario.",
            },
            { speaker: "patient", message: "See you. Thanks again." },
          ],
          sections: [
            {
              title: "Key Clinical Observations",
              content: [
                "Patient demonstrates clear catastrophic thinking patterns triggered by perceived criticism",
                "Strong connection identified between current anxiety and childhood experiences with critical parenting",
                "Core belief: Performance = Self-worth. Perfectionism as defense mechanism",
                "Good insight and awareness of pattern; willing to work on skills",
                "Primary anxiety triggers: work performance evaluation, interpersonal criticism",
              ],
            },
            {
              title: "Automatic Thoughts Identified",
              content: [
                '"I\'m a failure"',
                '"Everyone thinks I\'m incompetent"',
                '"I\'ll never be able to keep this job"',
                '"One mistake means I\'m fundamentally flawed"',
              ],
            },
            {
              title: "Emotions Reported",
              content:
                "Shame: 85/100\nAnxiety: 75/100\nDread about future: 65/100\nFear of judgment: 80/100",
            },
            {
              title: "Therapeutic Interventions Used",
              content: [
                "Validation and normalization of anxiety responses",
                "Cognitive defusion - separating thoughts from facts",
                "Thought challenging and evidence examination",
                "Psychoeducation about catastrophizing",
                "Exploration of historical roots (childhood parenting style)",
                "Introduction to coping strategies (breathing, thought records)",
                "Behavioral activation discussion (continuing normal activities despite anxiety)",
              ],
            },
            {
              title: "Homework Assigned",
              content: [
                "Practice thought examination when catastrophic thoughts arise",
                "Create a note on phone with thought-challenging questions",
                "Continue stress management practices (exercise, social connection)",
                "Begin tracking anxiety patterns and triggers",
                "Observe evidence throughout the week that catastrophic predictions don't occur",
              ],
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Badge",
            content:
              "Patient expressed significant shame around perceived workplace failures, linking current feelings to childhood experiences of parental criticism.",
          },
          {
            id: "n2",
            badge: "Badge",
            content:
              "Patient expressed significant shame around perceived workplace failures, linking current feelings to childhood experiences of parental criticism.",
          },
        ],
        bookmarks: [],
      },
      {
        id: "s2",
        date: "11.20",
        dayName: "Thursday",
        noteCount: 0,
        transcription: {
          sessionTitle: "Session S2",
          sessionDate: "2024-11-20",
          duration: "45 min.",
          sections: [
            {
              title: "Situation",
              content:
                "Follow-up session discussing progress since last meeting.",
            },
          ],
        },
        notes: [],
        bookmarks: [],
      },
    ],
  },
  [PATIENT_ID_002]: {
    id: PATIENT_ID_002,
    name: "Laura F.",
    patientId: "PZ-024",
    status: "intake",
    aiTranscription: "disabled",
    lastSession: "2024-09-18",
    recordedSessions: 1,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.18",
        dayName: "Monday",
        noteCount: 1,
        transcription: {
          sessionTitle: "Initial Assessment",
          sessionDate: "2024-09-18",
          duration: "60 min.",
          sections: [
            {
              title: "Situation",
              content: "Initial intake session with new patient.",
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Intake",
            content: "New patient presenting with anxiety symptoms.",
          },
        ],
        bookmarks: [],
      },
    ],
  },
  [PATIENT_ID_003]: {
    id: PATIENT_ID_003,
    name: "Giada D.",
    patientId: "PZ-025",
    status: "active",
    aiTranscription: "enabled",
    lastSession: "2024-09-15",
    recordedSessions: 5,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.15",
        dayName: "Sunday",
        noteCount: 1,
        transcription: {
          sessionTitle: "Session S5",
          sessionDate: "2024-09-15",
          duration: "50 min.",
          sections: [
            {
              title: "Situation",
              content: "Ongoing therapy session focusing on coping strategies.",
            },
          ],
        },
        notes: [
          {
            id: "n1",
            badge: "Progress",
            content:
              "Patient showing good progress with anxiety management techniques.",
          },
        ],
        bookmarks: [],
      },
    ],
  },
  [PATIENT_ID_004]: {
    id: PATIENT_ID_004,
    name: "Tommaso G.",
    patientId: "PZ-026",
    status: "active",
    aiTranscription: "disabled",
    lastSession: "2024-09-12",
    recordedSessions: 2,
    caseSummary: "",
    nextSessionPrep: "",
    sessions: [
      {
        id: "s1",
        date: "09.12",
        dayName: "Thursday",
        noteCount: 0,
        transcription: {
          sessionTitle: "Session S2",
          sessionDate: "2024-09-12",
          duration: "55 min.",
          sections: [
            {
              title: "Situation",
              content: "Second session exploring family dynamics.",
            },
          ],
        },
        notes: [],
        bookmarks: [],
      },
    ],
  },
};
