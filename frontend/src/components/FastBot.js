const FastBot = () => {
    const isMobile = window.innerWidth <= 768;
  
    return (
        <iframe
          style={{
            width: isMobile ? "100%" : "400px",
            height: isMobile ? "300px" : "500px",
            position: "fixed",
            bottom: isMobile ? "0" : "20px",
            right: isMobile ? "0" : "20px",
            border: "none",
            zIndex: 1000,
          }}
          src={`https://app.fastbots.ai/embed/${process.env.REACT_APP_FASTBOT_ID}`}
          title="Chatbot"
        ></iframe>
      );      
  };
export default FastBot;