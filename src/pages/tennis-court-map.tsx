import React, { useState, useCallback, useRef, useEffect } from 'react'
import { GoogleMap, InfoWindow, useJsApiLoader } from '@react-google-maps/api'


const containerStyle = {
  width: '100%',
  height: '500px'
}

//中心地の座標
const center = {
  lat: 35.6580339,
  lng: 139.7016358
}

//使用するライブラリを指定(GooglePlacesAPI)
const libraries: ("places")[] = ['places']

const TennisCourtMap: React.FC = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
    language: 'ja',
  })

  //地図、マーカー、テニスコート、ズームレベルの状態を管理
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<google.maps.Marker | null>(null)
  const [selectedTennisCourt, setSelectedTennisCourt] = useState<google.maps.places.PlaceResult | null>(null)
  const [zoomLevel, setZoomLevel] = useState(13)
  const [errorMessage, setErrorMessage] = useState('');
  const tennisMarkersRef = useRef<Array<google.maps.Marker>>([])

  //地図上のテニスコートのマーカーを削除する関数
  const clearTennisMarkers = useCallback(() => {
    tennisMarkersRef.current.forEach(marker => marker.setMap(null))
    tennisMarkersRef.current = []
  }, [])

  //mapオブジェクトが変更された時に発動
  useEffect(() => {
    if (!map) return

    //.getZoonメソッドで新しいズームを取得してステートにセット
    const updateZoomLevel = () => {
      const newZoomLevel = map.getZoom()
      setZoomLevel(newZoomLevel)
    }

    //zoom_changed...地図のズームレベルが変更された時に発動するイベント
    //ズームが変更されたらupdateZoomLevelが発動する
    map.addListener('zoom_changed', updateZoomLevel)

    return () => {
      google.maps.event.clearListeners(map, 'zoom_changed')
    }
  }, [map])

  //mapをクリックしたときに起こすアクション
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    //前回表示させたテニスコートのマーカーを削除、リセットする処理
    clearTennisMarkers()
    setSelectedTennisCourt(null)

    //クリックされた座標を取得
    const lat = e.latLng!.lat()
    const lng = e.latLng!.lng()

    if (selectedMarker) {
      selectedMarker.setMap(null)
    }

    //クリックした位置に新しいマーカーを配置
    const newMarker = new google.maps.Marker({
      position: { lat, lng },
      map: map,
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(40, 40)
      }
    })

    setSelectedMarker(newMarker)

    //PlacesServiceを使用、インスタンス作成
    const service = new google.maps.places.PlacesService(map)
    //3つの条件をもとにテニスコートの情報を取得
    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(lat, lng), //選択された座標
      radius: 5000, //半径5キロ
      keyword: 'tennis court テニスコート', //キーワード
      type: 'sports_complex',
    }

    //requestの情報をもとに近隣検索を開始
    //検索リクエストが成功したら、新たなマーカーを表示させる
    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach(place => {
          //placeオブジェクトにジオメトリ情報(場所の形状)とlocation情報(緯度と軽度)が存在するか確認
          if (place.geometry && place.geometry.location) {
            //取得したplaceの情報をもとにマーカーを配置
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                fillColor: 'red',
                fillOpacity: 0.8,
                scale: 14,
                strokeWeight: 1,
              },
              map: map,
            })

            //新しく取得したテニスコートの場所のリストをセット
            marker.addListener('click', () => {
              setSelectedTennisCourt(place)
            })

            //マーカーをテニスコートのマーカーリストに追加
            tennisMarkersRef.current.push(marker)
          }
        })
      } else {
        setErrorMessage('情報の取得に失敗しました。ページリロードをした後、再度お試しください。');
      }
    })
  }

  return isLoaded ? (
    <>
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <div className="flex items-center">
        <div className="bg-white p-6 md:p-12">
          <h1 className="text-3xl font-bold mb-4">テニスコート簡易検索</h1>
          <div className="text-1xl font-bold mb-3">使用方法...</div>
          <ul className="list-none list-inside text-gray-700 text-base space-y-2">
          <li>マップを選択すると、選択地点から半径5キロ以内にあるテニスコートの場所に赤いマーカーが表示されます。</li>
          <li>マーカーを押下するとテニスコート名、住所が表示されます。</li>
        </ul>
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel}
        onLoad={setMap}
        onClick={onMapClick}
      >
        {selectedTennisCourt && (
          <InfoWindow
            position={{
              lat: selectedTennisCourt.geometry.location.lat(),
              lng: selectedTennisCourt.geometry.location.lng()
            }}
            onCloseClick={() => setSelectedTennisCourt(null)}
          >
            <div>
              <h2>{selectedTennisCourt.name}</h2>
              <p>{selectedTennisCourt.vicinity}</p>
              {selectedTennisCourt.website && (
                <p><a href={selectedTennisCourt.website} target="_blank" rel="noopener noreferrer">Website</a></p>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  ) : 
  <></>
}

export default TennisCourtMap

