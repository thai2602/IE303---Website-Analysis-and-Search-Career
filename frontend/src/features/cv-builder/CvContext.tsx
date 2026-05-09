import { createContext, useContext, useState, ReactNode } from "react";

export interface Skill        { skillName: string; level: string }
export interface Experience   { company: string; position: string; startDate: string; endDate: string; description: string }
export interface Education    { school: string; major: string; startDate: string; endDate: string }
export interface Project      { name: string; description: string; technologies: string; link: string }

export interface CvData {
   fullName: string;
   jobTitle: string;
   email: string;
   phone: string;
   location: string;
   summary: string;
   color: string;
   skills: Skill[];
   experiences: Experience[];
   educations: Education[];
   projects: Project[];
}

export const defaultCvData: CvData = {
   fullName: "",
   jobTitle: "",
   email: "",
   phone: "",
   location: "",
   summary: "",
   color: "#7c3aed",
   skills: [],
   experiences: [],
   educations: [],
   projects: [],
};

interface CvContextType {
   cvData: CvData;
   setCvData: React.Dispatch<React.SetStateAction<CvData>>;
   isChatOpen: boolean;
   setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
   autoMessage: string | null;
   setAutoMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

const CvContext = createContext<CvContextType | undefined>(undefined);

export const CvProvider = ({ children }: { children: ReactNode }) => {
   const [cvData, setCvData] = useState<CvData>(defaultCvData);
   const [isChatOpen, setIsChatOpen] = useState(false);
   const [autoMessage, setAutoMessage] = useState<string | null>(null);

   return (
      <CvContext.Provider value={{ cvData, setCvData, isChatOpen, setIsChatOpen, autoMessage, setAutoMessage }}>
         {children}
      </CvContext.Provider>
   );
};

export const useCvContext = () => {
   const context = useContext(CvContext);
   if (!context) {
      return {
          cvData: defaultCvData, setCvData: () => {},
          isChatOpen: false, setIsChatOpen: () => {},
          autoMessage: null, setAutoMessage: () => {}
      };
   }
   return context;
};
