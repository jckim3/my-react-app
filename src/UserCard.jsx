function UserCard({ name, age, job,onClick }) {
    return (
      <div       
      onClick={() => onClick(name)} // ✅ 이름 전달
      style={{        
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '1rem',
        marginBottom: '1rem',
        width: '250px',
        textAlign: 'left'
      }}>
        <h3>{name}</h3>
        <p>나이: {age}</p>
        <p>직업: {job}</p>
      </div>
    );
  }
  
  export default UserCard;
  