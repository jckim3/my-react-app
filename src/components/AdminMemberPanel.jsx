import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, query, orderBy, limit } from 'firebase/firestore';

export default function AdminMemberPanel() {
  const [handicapData, setHandicapData] = useState([]);
  const [editingHandicap, setEditingHandicap] = useState(null);

  const fetchLatestHandicaps = async () => {
    const db = getDb();
    const userSnap = await getDocs(collection(db, 'golf_scores'));
    const promises = userSnap.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const userName = userData.name || 'Unknown';
      const historyRef = collection(db, `golf_scores/${userId}/handy_history`);
      const q = query(historyRef, orderBy('calculatedAt', 'desc'), limit(1));
      const latestSnap = await getDocs(q);
      if (latestSnap.empty) return null;
      const latestDoc = latestSnap.docs[0];
      const latest = latestDoc.data();
      return {
        name: userName,
        userId,
        docId: latestDoc.id,
        roundCount: latest.roundCount,
        scoreAverage: latest.scoreAverage,
        calculatedAt: latest.calculatedAt ? new Date(latest.calculatedAt).toLocaleDateString() : ''
      };
    });
    const result = (await Promise.all(promises)).filter(Boolean);
    setHandicapData(result);
  };

  const saveHandicapEdit = async () => {
    if (!editingHandicap) return;
    const db = getDb();
    const targetDoc = doc(db, 'golf_scores', editingHandicap.userId, 'handy_history', editingHandicap.docId);
    await updateDoc(targetDoc, {
      scoreAverage: Number(editingHandicap.scoreAverage)
    });
    setEditingHandicap(null);
    fetchLatestHandicaps();
  };

  useEffect(() => {
    fetchLatestHandicaps();
  }, []);

  return (
    <div>
      <h4 className="text-lg font-bold mt-10 mb-2">🏌️‍♂️ 멤버 핸디캡 현황</h4>
      <table className="table-auto w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">이름</th>
            <th className="border px-2 py-1">평균 점수</th>
            <th className="border px-2 py-1">라운드 수</th>
            <th className="border px-2 py-1">계산 날짜</th>
            <th className="border px-2 py-1">수정</th>
          </tr>
        </thead>
        <tbody>
          {handicapData.map((item, idx) => (
            <tr key={idx} className="text-center">
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">
                {editingHandicap?.userId === item.userId ? (
                  <input
                    type="number"
                    value={editingHandicap.scoreAverage}
                    onChange={(e) => setEditingHandicap({ ...editingHandicap, scoreAverage: e.target.value })}
                    className="border px-1 py-0.5 w-16 text-center"
                  />
                ) : (
                  item.scoreAverage
                )}
              </td>
              <td className="border px-2 py-1">{item.roundCount}</td>
              <td className="border px-2 py-1">{item.calculatedAt}</td>
              <td className="border px-2 py-1">
                {editingHandicap?.userId === item.userId ? (
                  <>
                    <button onClick={saveHandicapEdit} className="text-green-600 font-semibold px-1">저장</button>
                    <button onClick={() => setEditingHandicap(null)} className="text-gray-500 px-1">취소</button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingHandicap({
                      userId: item.userId,
                      docId: item.docId,
                      scoreAverage: item.scoreAverage
                    })}
                    className="text-blue-500 hover:underline"
                  >
                    수정
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
