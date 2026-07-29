export interface ContentType {
  id: string;
  title: string;
  value: string;
}

export interface IdentitasType {
  id: string;
  name: string;
  value: string;
}

export interface BeritaType {
  id: string;
  title: string;
  description: string;
  filepath: string;
  uploudat: string;
}

export interface PengumumanType {
  id: string;
  title: string;
  file_path: string;
  uploadat: string;
}

export interface BerkasType {
  id: string;
  title: string;
  filepath: string;
  uploadat: string;
}

export interface DosenType {
  id: string;
  nama: string;
  nik: string;
  foto: string;
  jenis_dosen: string;
  create_at: Date;
}

export interface StafType {
  id: string;
  nama: string;
  nitk: string;
  foto: string;
  create_at: string;
}

export interface FaqType {
  id: string;
  question: string;
  answer: string;
  created_at: Date;
}

export interface ProdiType {
  id: string;
  nama: string;
  link: string;
  visi: string;
  misi: string;
}

export interface VisitData {
  date: string;
  count: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
