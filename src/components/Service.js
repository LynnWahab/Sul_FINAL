import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  ScrollView,
  FlatList,
  Button,
  Easing,
  RefreshControl
} from 'react-native';
import Comments from './Comments';
import Star from 'react-native-star-view';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { MaterialDialog } from 'react-native-material-dialog';
import DialogInput from 'react-native-dialog-input';
import ZoomImage from 'react-native-zoom-image';
import Communications from 'react-native-communications';
import ImagePicker from 'react-native-image-picker';
import axios from 'axios';


export default class ProductDetail extends Component {
  constructor(props){
    super(props);
    this.state = {
      userId: this.props.navigation.state.params.userId,
      listingId: this.props.navigation.state.params.id,
      subCategoryTitle: this.props.navigation.state.params.subCategoryTitle,
      avgRating:  this.props.navigation.state.params.stars,
      loaded1: false,
      loaded2: false,
      loaded3: false,
      dialogVisible: false,
      rateVisible: false,
      phoneVisible:false,
      phonenVisible:false,
      phonen: "34808",
      uploadImages: null,
      images:[
        {id: 1, url: "https://bootdey.com/img/Content/avatar/avatar1.png"},
        {id: 2, url: "https://bootdey.com/img/Content/avatar/avatar6.png"},
        {id: 3, url: "https://bootdey.com/img/Content/avatar/avatar7.png"},
        {id: 4, url: "https://bootdey.com/img/Content/avatar/avatar2.png"},
        {id: 5, url: "https://bootdey.com/img/Content/avatar/avatar3.png"},
       ],
       refreshing: true,

    }
  }
  
  handleCancel = () => {
    this.setState({ dialogVisible: false });
  }
  showDialog(isShow){
    this.setState({dialogVisible: isShow});
  }
  handleComment = (comment: string) => {
    console.log(comment);
    
    axios({
      method: 'post',
      url: 'https://rolodex2.azurewebsites.net/api/v1/User/addComment?code=DQzhL1VTa16VEZkR3EOCB2MdgtmllfFgMcW/PVjzMQVv89n7ksR1Iw==',
      data: {
        USERID: this.state.userId,
        LISTINGID: this.state.listingId,
        COMMENT: comment
      }
    }).then((response) => {
      this.setState({loaded3: true});
      console.log(response.data);
    })
    if (this.state.loaded3){
      this.setState({ dialogVisible: false });
    }
    this.setState({ dialogVisible: false });
    this.fetchData1();
  }

  handleRCancel = () => {
    this.setState({ rateVisible: false });
  }
  handleRInput = () => {
    console.log(this.state.userId);
    console.log(this.state.listingId);
    console.log(this.state.ratingValue);
    axios({
      method: 'post',
      url: 'https://rolodex2.azurewebsites.net/api/v1/user/addRating?code=DQzhL1VTa16VEZkR3EOCB2MdgtmllfFgMcW/PVjzMQVv89n7ksR1Iw==',
      data: {
        LISTINGID: this.state.listingId,
        USERID: this.state.userId,
        STARS: this.state.ratingValue
      }
    }).then((response) => {
      console.log(response.data);
    })

    this.setState({ rateVisible: false });
  }
  showRDialog(isShow){
    this.setState({rateVisible: isShow});
  }

  showPDialog(isShow){
    this.setState({phoneVisible: isShow});
  }
  handlePCancel = () => {
    this.setState({ phoneVisible: false });
  }
  handleSendPhone = (phone: string) => {
    console.log(phone);
    axios({
          method: 'post',
          url: 'https://rolodex2.azurewebsites.net/api/v1/Lisitng/claimListing?code=DQzhL1VTa16VEZkR3EOCB2MdgtmllfFgMcW/PVjzMQVv89n7ksR1Iw==',
          data: {
            LISTINGID: this.state.listingId,
            USERID: this.state.userId,
          }
        }).then((response) => {
          console.log(response.data);
        })

    this.setState({ phoneVisible: false });
  }

  ratingCompleted(rating) {
    console.log(rating)
  }
  handleClose = () => {
    this.setState({phonenVisible: false})
  }
  renderImages = ()=>{
    return this.state.images.map((d)=>(
      
      <ZoomImage 
        source={{ uri: d.url }}
        imgStyle={styles.oneim}
        duration={200}
        enableScaling={false}
        easingFunc={Easing.ease}
      />
      ));
  }
  handleChoosePhoto = () => {
    const options = {
      noData: true,
    };
    ImagePicker.showImagePicker(options, response => {
        this.setState({ uploadImages: response.uri });
    });
  };


  componentDidMount() {
    this.fetchData1();
    this.fetchData2();
  }

  fetchData1 = () => {
    axios.get('https://rolodex2.azurewebsites.net/api/v1/Listings/' + this.state.listingId +'/listing?code=DQzhL1VTa16VEZkR3EOCB2MdgtmllfFgMcW/PVjzMQVv89n7ksR1Iw==')
        .then((response) => {
            this.setState({data: response.data});
            this.setState({phonen: this.state.data.PHONENUMBER});
            this.setState({loaded1: true});
            console.log("Service Profile Page data fetched:");            
            console.log(response.data);
            console.log(this.state.data.UserID);
      });
      this.setState({
        refreshing: false})
  }

  fetchData2 = () => {
    axios.get('https://rolodex2.azurewebsites.net/api/v1/Listing/' + this.state.listingId +'/comments?code=DQzhL1VTa16VEZkR3EOCB2MdgtmllfFgMcW/PVjzMQVv89n7ksR1Iw==')
        .then((response) => {
            this.setState({COMMENTS: response.data});
            this.setState({loaded2: true});
            console.log("comments data fetched:");            
            console.log(this.state.data.UserID == null);
            console.log(response.data);
      });
      this.setState({
        refreshing: false})
  }
  onRefresh() {
    this.fetchData1();
    this.fetchData2();

  }



  render() {
    claimBtn = ()=> {
      if(this.state.data.UserID == null) {
        return ( <TouchableOpacity onPress={()=> this.showPDialog(true)}> 
                     <Text style = {styles.buttonText2}> تبنّى الخدمة </Text>
                 </TouchableOpacity>);
      }
    }

    feadBackBtns = ()=> {
      if(this.state.data.UserID != this.state.userId) {
        return ( <View style={styles.starContainer}>
                    <TouchableOpacity style={styles.rate} onPress={()=> this.showRDialog(true)}>
                      <Text style={styles.shareButtonText}>تقييم</Text>  
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.rate} onPress={()=>{this.showDialog(true)}} >
                      <Text style={styles.shareButtonText}>تعليق</Text> 
                    </TouchableOpacity>
                  </View>);
      }
    }

    const args = {
      number: '909390000', 
      prompt: false 
    };
    const options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
   };

   {if (this.state.loaded1 && this.state.loaded2) {
    return (
      <View style={styles.container}>

        <MaterialDialog
          style={{alignSelf: 'row-reverse'}}
          visible={this.state.phonenVisible}
          cancelLabel="ok"
          onCancel={() => {this.handleClose()}}
          >
          <TouchableOpacity style={styles.phonenum} onPress={()=> Communications.phonecall(this.state.phonen, false)}>
            <Text style={styles.name}> {this.state.phonen} </Text>
          </TouchableOpacity>
        </MaterialDialog>

        <DialogInput isDialogVisible={this.state.phoneVisible}
            title={"أدخل رمز التأكيد"}
            submitText = {"إدخال"}
            cancelText = {"إلغاء"}
            submitInput={(inputPhone) => {this.handleSendPhone(inputPhone)} }
            closeDialog={ () => {this.handlePCancel()}}>
        </DialogInput>

        <DialogInput isDialogVisible={this.state.dialogVisible}
            title={"أدخل تعليق"}
            submitText = {"إدخال"}
            cancelText = {"إلغاء"}
            submitInput={(inputComment) => {this.handleComment(inputComment)} }
            closeDialog={ () => {this.handleCancel()}}>
        </DialogInput>

        <MaterialDialog
          style={{alignSelf: 'row-reverse'}}
          title="إدخل التقييم المناسب للخدمة"
          visible={this.state.rateVisible}
          cancelLabel="إلغاء"
          okLabel="إدخال" 
          onOk={() => {this.handleRInput()}}
          onCancel={() => {this.handleRCancel()}}>
            <Rating   
            onFinishRating={this.ratingCompleted}
            />
        </MaterialDialog>

        <ScrollView
          refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)} 
          />}>
          <View style={{alignItems:'center', marginHorizontal:30}}>
            <Image style={styles.productImg} source={require('../images/profile.png')}/>
            <Text style={styles.name}> {this.state.data.TITLE} </Text>
            <Text style={styles.price}> {this.state.subCategoryTitle}</Text>
            <Star style={styles.starStyle} score={this.state.avgRating} />
          </View>

          <View style={styles.addToCarContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={()=> this.setState({ phonenVisible: true }) }>
              <Text style={styles.shareButtonText}>اتّصل</Text>  
            </TouchableOpacity>
          </View>
          {claimBtn()}
          <View style={styles.separator}></View>

            {feadBackBtns()}

          <View style={styles.container}>
        <View style={styles.imges}>
        
        <ScrollView horizontal >
            {this.renderImages()}
            <TouchableOpacity onPress={()=> {this.handleChoosePhoto()}}>
              <Image
                style={styles.oneim}
                source ={require('../images/plus.png')}
              />
            </TouchableOpacity>
        </ScrollView>
        
      </View>
          <View style={styles.addComment}>
            <Comments COMMENTS = {this.state.COMMENTS} userId = {this.state.userId}/>
          </View> 
       </View>
        </ScrollView>
      </View>
    );}else {
      return(
        <View style={styles.load}>
          < ActivityIndicator/>
        </View>
        )
    }
  
  }
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginTop:0,
  },
  productImg:{
    width:150,
    height:150,
  },
  name:{
    marginTop: 10,
    fontSize:28,
    color:"#696969",
    fontWeight:'bold',
  },
  price:{
    marginTop:10,
    fontSize:18,
    color:"green",
    fontWeight:'bold'
  },
  star:{
    width:40,
    height:40,
  },
  btnColor: {
    height:30,
    width:30,
    borderRadius:30,
    marginHorizontal:3,
  },
  btnSize: {
    height:40,
    width:40,
    borderRadius:40,
    borderColor:'#12CBC4',
    borderWidth:1,
    marginHorizontal:3,
    backgroundColor:'white',

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starContainer:{
    justifyContent:'center', 
    marginHorizontal:30, 
    flexDirection:'row', 
    marginTop:5
  },
  separator:{
    height:2,
    backgroundColor:"#eeeeee",
    marginTop:20,
    marginHorizontal:30
  },
  shareButton: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "#12CBC4",
  },
  ratepop: {
    marginTop:10,
    height:200,
    width: 300,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius:30,
    borderWidth: 0.5,
    backgroundColor: 'white'
  },
  shareButtonText:{
    color: "#FFFFFF",
    fontSize:20,
  },
  addToCarContainer:{
    marginHorizontal:30
  },
  addComment:{
    textAlign:'left',
    marginTop:10,
    padding: 10,
    color:"#696969",     
  },
  enter:{
    textAlign:'left',
    marginTop:10,
    padding: 10,
    color:"#696969",   
  },
  rate:{
    marginTop:10,
    height:35,
    width:100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:30,
    backgroundColor: "orange",
    marginLeft: 20,
    marginRight: 20,
  },
  buttonText2: {
      textAlign: 'center',
      color: '#12CBC4',
      fontWeight: '500',
      textDecorationLine: 'underline',
      marginTop: 7,
  },
  imges: {
    flex: 1,
    justifyContent: "center",
    height: '40%',
    padding: 10,
    marginTop:10,

  },
  oneim: {
    height: 80,
    marginLeft: 5,
    marginRight: 5,
    width: 80,
  },
  phonenum: {
    textAlign: 'center',
    fontSize: 30,
  }
});