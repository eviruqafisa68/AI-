import {create} from 'zustand'; import {projects as seed} from '../data/mockData'; import type {Project} from '../types';
type State={projects:Project[];toast:string;setToast:(v:string)=>void;addProject:(v:Project)=>void};
export const useAppStore=create<State>(set=>({projects:seed,toast:'',setToast:toast=>set({toast}),addProject:p=>set(s=>({projects:[p,...s.projects]}))}));
