/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  Image,
  StyleSheet,
  ListView,
  ToastAndroid,
  PanResponder,
  Text,
  View,
  Animated,
} from 'react-native';

var WEATHER = 'http://api.map.baidu.com/telematics/v3/weather?location=%E5%8C%97%E4%BA%AC&output=json&ak=8UI6PHtek99nSfQdnoC0Pawf';
var titlePanResponder = {};
var itemPanResponder = {};

class WeatherProj extends Component {
  constructor(props) {
      super(props);   //这一句不能省略，照抄即可
      this.state = {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        }),
        loaded: false,
        results: null,  //这里放你自己定义的state变量及初始值
        bounceValue: new Animated.Value(0),
      };
    }

  componentDidMount() {
    this.fetchData();
  }

  componentWillMount(){
      this.titlePanResponder = new PanResponder.create({
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onShouldBlockNativeResponder: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
          ToastAndroid.show('Title_OnPanResponderGrant', ToastAndroid.SHORT);
        },
        onPanResponderMove: (evt, gestureState) => {
          // ToastAndroid.show('onPanResponderMove', ToastAndroid.SHORT);
        },
        onPanResponderRelease: (evt, gestureState) => {
          ToastAndroid.show('Title_OnPanResponderRelease', ToastAndroid.SHORT);
        },
        onPanResponderTerminate: (evt, gestureState) => {
          ToastAndroid.show('Title_OnPanResponderTerminate', ToastAndroid.SHORT);
        },
      });
      this.itemPanResponder = new PanResponder.create({
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => true,
        onShouldBlockNativeResponder: (evt, gestureState) => true,

        onPanResponderGrant: (evt, gestureState) => {
          ToastAndroid.show('Item_OnPanResponderGrant', ToastAndroid.SHORT);
        },
        onPanResponderMove: (evt, gestureState) => {
          // ToastAndroid.show('onPanResponderMove', ToastAndroid.SHORT);
        },
        onPanResponderRelease: (evt, gestureState) => {
          ToastAndroid.show('Item_OnPanResponderRelease', ToastAndroid.SHORT);
        },
        onPanResponderTerminate: (evt, gestureState) => {
          ToastAndroid.show('Item_OnPanResponderTerminate', ToastAndroid.SHORT);
        },
      });
  }

  fetchData() {
    fetch(WEATHER)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.results[0].weather_data),
          loaded: true,
          results: responseData.results,
        });
      })
      .done();
  }

  render(){
    if (!this.state.results) {
        this.state.bounceValue.setValue(1.5);     // 设置一个较大的初始值
        Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
        this.state.bounceValue,                 // 将`bounceValue`值动画化
        {
          toValue: 1,                         // 将其值以动画的形式改到一个较小值
          friction: 1,                          // Bouncier spring
        }
      ).start();
      return this.renderLoadingView();
    }

    var weather = this.state.results[0];
    this.showToast('天气数据拉取成功');
    return this.renderData(weather);
  }

  showToast(text){
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

  renderLoadingView() {
    return (
      <View style={styles.loading}>
        <Animated.Image
          source={require('../res/rating_light.png')}
          style={[styles.loading_icon,
            {
              transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                {scale: this.state.bounceValue},  // 将`bounceValue`赋值给 `scale`
              ]}
            ]}//{styles.loading_icon}
        />
        <Text>
          正在加载天气数据……
        </Text>
      </View>
    );
  }

  renderData(data) {
    return (
      <View style={styles.container}>
        <View style={styles.barBox} {...this.titlePanResponder.panHandlers}>
          <Text style={styles.barTitle}>{data.currentCity}</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderWeather}
          style={styles.listView}
        />
      </View>
    );
  }

  renderWeather(weather){
    return (
      <View style={styles.item}>
        <Image
          source={{uri: weather.dayPictureUrl}}
          style={styles.icon}
        />
        <View>
          <Text style={styles.infoTitle}>{weather.date}</Text>
          <Text style={styles.infoText}>{weather.weather} {weather.wind} {weather.temperature}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  loading_icon:{
    width: 70,
    height: 45,
    marginBottom: 30,
  },
  loading:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  container:{
    backgroundColor: '#FFFFFF',
  },
  barBox:{
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FDE75D',
  },
  item:{
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  barTitle:{
    fontSize: 20,
    textAlign: 'center'
  },
  icon:{
    width: 42,
    height: 30,
    marginRight: 30,
  },
  infoTitle:{
    fontSize: 15,
    textAlign: 'center',
  },
  infoText:{
    fontSize: 13,
    textAlign: 'center',
  },
  listView: {
  backgroundColor: '#FFFFFF',
},
});

AppRegistry.registerComponent('WeatherProj', () => WeatherProj);
