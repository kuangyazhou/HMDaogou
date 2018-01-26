import React from 'react';
import {
  Container,
  View,
} from 'amazeui-touch';

// Assets.
import '../../../imgs/empty.jpg';

export default function NotFound() {
  return (
    <View>
      <Container className="ks-grid">
        <div className="hm-notfound-img">
          <img src="../../../imgs/empty.jpg" alt="空" />
        </div>
        <div className="hm-notfound-text">
          <p>当前页面正在维护中, 请稍后在来...</p>
        </div>
      </Container>
    </View>
  );
}
