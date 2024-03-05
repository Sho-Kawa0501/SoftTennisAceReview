import React,{ useEffect,createContext,useMemo,useContext,useState} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Link from 'next/link'
import { AppDispatch,} from 'app/store'
import { getItemList,getItemMetaDataList } from '../lib/item'
import ItemFilterModal from 'components/templates/ItemFilterModal'
import Head from 'next/head'
import { InferGetStaticPropsType,NextPage,GetStaticProps } from 'next'
import { StaticItemMetaDataType,Brand,Series,Position,Item } from 'types/itemTypes'
import { selectIsButtonDisabled } from 'features/app/appSlice'
import { setItems,setSeries,} from 'features/item/itemSlice'
import ItemCardList from 'components/organisms/ItemCardList'
import AppButton from 'components/Atoms/AppButton'
import { AlertMessage } from 'components/Atoms/AlertMessage'
import { useAlertAuthMessage } from 'hooks/account/useAlertAuthMessage'
import { selectFilterdItems } from 'features/item/itemSlice'


type ItemContextProps = {
  items: Item[],
  brands: Brand[],
  series: Series[],
  positions: Position[],
}

export const ItemContext = createContext<ItemContextProps>({
  items: [],
  brands: [],
  series: [],
  positions: [],
})

type ReviewPageProps = InferGetStaticPropsType<typeof getStaticProps>

const Index:NextPage<ReviewPageProps> = React.memo(({ staticItems,staticItemMetaData }:ReviewPageProps) => {
  const dispatch:AppDispatch = useDispatch()
  const { showMessage } = useAlertAuthMessage()
  const filteredItems = useSelector(selectFilterdItems)
  const isButtonDisabled = useSelector(selectIsButtonDisabled)
  const contextValue = useMemo(() => ({
    items:staticItems,
    ...staticItemMetaData
  }), [staticItems,staticItemMetaData])

  useEffect(() => {
    if(staticItems) dispatch(setItems(staticItems))
    if(staticItemMetaData) {
      dispatch(setSeries(staticItemMetaData.series))
    }
  }, [staticItems, staticItemMetaData])

  return (
    <>
      <Head>
        <title>SoftTennisAceReview</title>
      </Head>
      {showMessage.show &&
        <> 
          <AlertMessage message={showMessage.message} color={showMessage.color} />
        </>
      }
      <ItemContext.Provider value={contextValue}>
        <ItemFilterModal />
      </ItemContext.Provider>
      <Link href={`/site-information`}>
        <AppButton type={"submit"} color="purple" disabled={isButtonDisabled}>
          サイト案内           
        </AppButton>
      </Link>
      <Link href={`/tennis-court-map`}>
        <AppButton type={"submit"} color="red" disabled={isButtonDisabled}>
          簡易テニスコートマップ
        </AppButton>
      </Link>
      <div className="flex flex-wrap">
        <ItemCardList items={filteredItems} />
      </div>
    </>
  )
})

Index.displayName = "Index"
export default Index

export const getStaticProps: GetStaticProps<{
  staticItems: Item[]
  staticItemMetaData: StaticItemMetaDataType
  }> = async() =>  {
  const staticItems = await getItemList()
  const staticItemMetaData = await getItemMetaDataList()

  return {
    props: { 
      staticItems,
      staticItemMetaData,
    },
  }
}