// Document
interface IDocumentDB {
  createdAt: number;
  updatedAt: number | null;
  _destroy: boolean;
}
type DocumentRes = Omit<IDocumentDB, '_destroy'>;

// User
interface IUserDocument extends IDocumentDB {
  email: string;
  username: string;
  password: string;
}
type ResUser = Omit<IUserDocument, 'password'> & DocumentRes;
