import React, { useState } from 'react';
//
// import { getDb } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getDb, getAuthInstance } from './lib/firebase';

function UserCard({ name, age, job,onClick }) {

  const [selected, setSelected] = useState(false);
  const handleClick = async() => {
    setSelected(!selected); // 상태 토글
    onClick?.(name);        // 외부 이벤트 호출 (선택 사항)

// 🔥 Firestore에 저장

    const timestamp = new Date().toISOString();
    const db = getDb(); // ✅ 여기가 빠졌었음!
    const auth = getAuthInstance();
    const user = auth.currentUser;
    try {
      await addDoc(collection(db, 'user_clicks'), {
        name,
        timestamp,
        uid: user ? user.uid : null // ✅ 로그인 유저 정보
      });
      // console.log(`✅ Firestore 저장 완료: ${name} - ${timestamp}`);
      console.log(`✅ Firestore 저장: ${name}, uid=${user?.uid ?? '비로그인'}, 시간=${timestamp}`);
    } catch (error) {
      console.error("❌ Firestore 저장 실패:", error);
    }


  };

  // 이건 JSX 문법이고, React에서는 컴포넌트 함수는 JSX를 return해야 합니다.
    return (
      <div       
      // onClick={() => onClick(name)} // ✅ 이름 전달
      onClick={handleClick}
      // style={{        
      //   border: '1px solid #ccc',
      //   borderRadius: '10px',
      //   padding: '1rem',
      //   marginBottom: '1rem',
      //   width: '250px',
      //   textAlign: 'left'
      // }}>
        className={`cursor-pointer p-4 rounded shadow transition ${
           selected ? 'bg-blue-200' : 'bg-white'
            }`}
          >   
        <h3>{name}</h3>
        <p>나이: {age}</p>
        <p>직업: {job}</p>
      </div>
    );
  }
  
  export default UserCard;
  