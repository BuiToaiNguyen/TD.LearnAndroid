import * as React from 'react';
import {useState, useMemo, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Alert, NativeModules, Image, TouchableHighlight, Pressable, TouchableOpacity} from 'react-native';
import {useCameraDevices} from 'react-native-vision-camera';
import {Camera, frameRateIncluded} from 'react-native-vision-camera';
import {Button} from 'react-native-paper';
import RNFS, {DownloadDirectoryPath} from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome5Pro';
import {TDButtonPrimary, TDButtonSecondary, TDDividerWithTitle} from '@app/components';
import {Root, Toast} from 'react-native-popup-confirm-toast';
import {useNavigation} from '@react-navigation/native';
import GLOBAL_API from '@app/screen/services/apiServices';
import {REACT_APP_URL} from '@app/config/Config';
import { useSelector } from 'react-redux';

export default function ChupBienSo() {
  const {id} = useSelector(state => state.global.userInfo);
  const navigation = useNavigation()
  const [hasPermission, setHasPermission] = React.useState(false);
  const devices = useCameraDevices();
  const [huongCam, setHuongCam] = useState('front');
  const device = devices[huongCam];
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [flash, setFlash] = useState(false);
  const [dataCustomer, setData] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [isViewCustomer, setIsViewCustomer] = useState(false);
  useEffect(() => {
    const func = async () => {
      if (image !== null) {
        const arrFileName = image.split('/');
        const filename = arrFileName[arrFileName.length - 1];
        photoPath = `${DownloadDirectoryPath}/${filename}`;
        await RNFS.moveFile(image, photoPath);
      }
    };
    func();
  }, []);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);
  const dataPostTest = {
    imageBase64:
      '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',
    idUserScan: id,
  };

  const btnViewCustomer =()=>{
    navigation.navigate('ChiTietKhachHang', {idCustomer: dataCustomer?.customer?.id});

  }
  useEffect(() => {
    (async () => {
      if (imageBase64 != null) {
        console.log("callApi")
        const data = await GLOBAL_API.requestPOST(`${REACT_APP_URL}api/ActionScans`,dataPostTest);
        
        Toast.show({
          title: data?.data?.licensePlate,
          text: 'Biển số  '+data.data?.status,
          color: '#702c91',
          timeColor: '#440f5f',
          timing: 10000,
          icon: <Icon name={data.data?.status !=  "Còn hạn"?  'window-close' :'check'} color={'#fff'} size={31} 
          />,
          position: 'top',
        });
        setIsViewCustomer(true)
        console.log(data.data)
        setData(data.data)
        setTimeout(()=>{
          setIsViewCustomer(false)
         },10000)

      }
    })();
  }, [imageBase64]);

  const takePhotos = async () => {
    try {
      setIsViewCustomer(false)
      console.log('bđ chụp');

      const photo = await camera.current.takePhoto({
        // flash: flash,
      });
      setImage('file://' + photo.path);
      RNFS.readFile('file://' + photo.path, 'base64').then(res => {

        setImageBase64(res)
      });

     
    } catch (e) {
      console.error(e);
    }
  };

  const renderCamera = () => {
    const navigation = useNavigation();
    if (device == null) {
      return (
        <View>
          <Text style={{color: '#fff'}}>Loading</Text>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, paddingVertical: 28}}>
          {device != null && hasPermission && (
            <>
              <Camera ref={camera} style={StyleSheet.absoluteFill} device={device} photo={true} isActive={true} />
              <Pressable style={styles.box} onPress={takePhotos}></Pressable>
              {
                isViewCustomer &&

              <Pressable style={styles.viewCustomer} onPress={btnViewCustomer}>
                <Text style={{textAlign:'center',color:'white'}}>Xem chi tiết khách hàng</Text>
              </Pressable>
              }

              <Pressable style={styles.buttonRotate} onPress={() => setHuongCam(pre => (pre == 'front' ? 'back' : 'front'))}>
                <Icon name="sync" size={30} color={'#fff'} />
              </Pressable>

              <Pressable
                style={{position: 'absolute', top: 5, left: 5}}
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon name="times-circle" size={30} color={'#fff'} />
              </Pressable>

              <Pressable
                style={styles.buttonFlash}
                onPress={() => {
                  setFlash(pre => !pre);
                }}>
                <Icon name="bolt" size={30} color={'#fff'} />
              </Pressable>
              {image && <Image source={{uri: image}} style={styles.image}></Image>}
            </>
          )}
          <Root>
            <View>
              <TouchableOpacity
                onPress={() =>
                  Toast.show({
                    title: 'Dikkat!',
                    text: 'Mutlak özgürlük, kendi başına hiçbir anlam ifade etmez.',
                    color: '#702c91',
                    timeColor: '#440f5f',
                    timing: 5000,
                    icon: <Icon name={'check'} color={'#fff'} size={31} />,
                    position: 'top',
                  })
                }>
                <Text></Text>
              </TouchableOpacity>
            </View>
          </Root>
        </View>
      );
    }
  };
  return <View style={{flex: 1}}>{renderCamera()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 8,
    backgroundColor: 'aliceblue',
  },viewCustomer:{
    width: '30%',
    position: 'absolute',
    right: '35%',
    top: 100,
    textAlign:'center',
    backgroundColor:'blue',
    padding:10,
    borderRadius:20

  },
  buttonRotate: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 5,
    top: 100,
  },
  buttonFlash: {
    width: 60,
    height: 60,
    position: 'absolute',
    right: 5,
    top: 50,
  },
  box: {
    width: 75,
    height: 75,
    position: 'absolute',
    bottom: 40,
    left: '40%',
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    alignSelf: 'flex-start',
    marginHorizontal: '1%',
    marginBottom: 6,
    minWidth: '48%',
    textAlign: 'center',
  },
  selected: {
    backgroundColor: 'coral',
    borderWidth: 0,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'coral',
  },
  selectedLabel: {
    color: 'white',
  },
  label: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 24,
  },
  image: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    width: 75,
    height: 100,
  },
});