// components/AdminGolfPage.jsx
import AdminCoursePanel from './AdminCoursePanel';
import SetWeeklyCourse from './SetWeeklyCourse';

export default function AdminGolfPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⛳️ 골프장 관리자 페이지</h1>
      <SetWeeklyCourse />
      <hr className="my-6" />
      <AdminCoursePanel />
    </div>
  );
}
