import React, { useState } from 'react';

function UserCard({ name, age, job,onClick }) {

  const [selected, setSelected] = useState(false);
  const handleClick = () => {
    setSelected(!selected); // 상태 토글
    onClick?.(name);        // 외부 이벤트 호출 (선택 사항)
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
  