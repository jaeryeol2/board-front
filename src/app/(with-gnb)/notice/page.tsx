export default async function NoticePage() {
  const notices = [
    { id: 1, title: '새로운 기능 업데이트 안내', date: '2024-07-25' },
    { id: 2, title: '서비스 점검 안내 (2 AM - 4 AM)', date: '2024-07-24' },
    { id: 3, title: '개인정보처리방침 변경 안내', date: '2024-07-20' },
    { id: 4, title: '여름 휴가 시즌 고객센터 운영 안내', date: '2024-07-15' },
  ];

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">공지사항</h1>
      <p className="text-gray-600 mb-8">
        서비스 관련 최신 소식을 확인하세요.
      </p>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                제목
              </th>
              <th scope="col" className="px-6 py-3">
                게시일
              </th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id} className="bg-white border-b hover:bg-gray-50">
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {notice.title}
                </th>
                <td className="px-6 py-4">{notice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
