import { hot } from "react-hot-loader/root";
import React from "react";

class Hello extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: new Date().toISOString(),
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: new Date().toISOString(),
      });
    }, 1000);
  }

  render() {
    return <div>{this.state.time}</div>;
  }
}

export default hot(Hello);
