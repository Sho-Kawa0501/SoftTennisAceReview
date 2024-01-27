import axios from 'axios'
import { StaticItemMetaDataType, } from "types/itemTypes"
import { Item } from 'types/itemTypes'
import { handleAxiosError } from "./utils/HandleAxiosError"

export const getItemList = async (): Promise<Item[]> => {
  try {
    const res = await axios.get<Item[]>
    (`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/item/item_list/`)
      return res.data
  } catch(error) {
    throw handleAxiosError(error)
  }
}

export const getItemDetail = async (id: number): Promise<Item> => {
  try {
  const res = await axios.get<Item>
  (`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/item/item_detail/${id}/`)
    return res.data
  } catch(error) {
    throw handleAxiosError(error)
  }
}

export const getItemMetaDataList = async(): Promise<StaticItemMetaDataType> => {
  try {
    const res = await axios.get<StaticItemMetaDataType>
    (`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/item/item_metadata_list/`,)
  return res.data
  } catch(error) {
    throw handleAxiosError(error)
  }
}

export const getItemIds = async (): Promise<{ params: { itemId: string } }[]> => {
  try {
    const res = await axios.get<{ id: string }[]>
    (`${process.env.NEXT_PUBLIC_API_BASE_PATH}/api/item/item_list/`)
    return res.data.map(item => ({
      params: {
        itemId: item.id.toString()
      }
    })
    )
  } catch (error) {
    throw handleAxiosError(error)
  }
}
