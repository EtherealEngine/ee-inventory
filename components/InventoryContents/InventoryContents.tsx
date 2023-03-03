import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { ArrowBackIos, FilterList } from '@mui/icons-material'
import styles from
  '@etherealengine/client-core/src/user/components/UserMenu/UserMenu.module.scss'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Grid,
  Divider,
  Box,
  Card,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  Stack
} from '@mui/material'
import { usePrevious } from '@etherealengine/client-core/src/hooks/usePrevious'
import { InventoryService, useInventoryState } from '../services/InventoryService'

const ITEM_HEIGHT = 48
type Props = {
  id,
  changeActiveMenu
}

const InventoryContents = (props: Props) => {

  const { id, changeActiveMenu } = props
  const { data, user, isLoadingTransfer } = useInventoryState().value

  const { t } = useTranslation()
  const [state, setState] = useState({
    url: '',
    metadata: '',
    selectedId: '',
    userid: '',
    anchorElement: null,
    selectedType: '',
    inventory: []
  })
  const {
    url, metadata, userid, selectedId, anchorElement, selectedType, inventory
  } = state
  const prevState = usePrevious({ selectedType })

  const coinData = []

  const open = Boolean(anchorElement)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setState((prevState: any) => ({
      ...prevState,
      anchorEl: event.currentTarget
    }))
  }
  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      anchorEl: null
    }))
  }
  const handletypeselect = (id) => {
    setState((prevState) => ({
      ...prevState,
      selectedType: id
    }))
    handleClose()
  }

  useEffect(() => {
    if (data.length !== 0) {
      setState((prevState: any) => ({
        ...prevState,
        url: data[0].url,
        metadata: data[0].metadata,
        selectedid: data[0].user_inventory.userInventoryId,
        inventory: [...data]
      }))
    }

    return () => {
      setState({
        url: '',
        metadata: '',
        selectedid: '',
        userid: '',
        anchorEl: null,
        selectedType: '',
        inventory: []
      })
    }
  }, [])

  useEffect(() => {
    if (prevState) {
      if (prevState.selectedType !== selectedType) {
        if (selectedType === '') {
          setState((prevState: any) => ({
            ...prevState,
            url: data[0].url,
            metadata: data[0].metadata,
            selectedid: data[0].user_inventory.userInventoryId,
            inventory: [...data]
          }))
        } else {
          let filtereddata = data.filter(
            (val) => val.inventoryItemTypeId === selectedType
          )
          if (filtereddata.length !== 0) {
            setState((prevState: any) => ({
              ...prevState,
              url: filtereddata[0].url,
              metadata: filtereddata[0].metadata,
              selectedid: filtereddata[0].user_inventory.userInventoryId,
              inventory: [...filtereddata]
            }))
          } else {
            setState((prevState: any) => ({
              ...prevState,
              url: '',
              metadata: '',
              selectedid: '',
              inventory: []
            }))
          }
        }
      }
    }
  }, [selectedType])

  return (
    <div className={`${styles.inventoryContents}`}>
      <Box sx={{ p: 2 }} className={`${styles.root} ${styles.contents}`}>
        <Stack direction="row" justifyContent="space-between" className={styles.title}>
          <IconButton
            sx={{ svg: { color: 'white' } }}
            className={styles.backButton}
            onClick={() => changeActiveMenu(null)}
          >
            <ArrowBackIos />
          </IconButton>
          <Typography className={`${styles.title} ${styles.titlesize}`}>{t('user:inventory.inventory')}</Typography>
          <Stack direction="row" justifyContent="center">
            <Stack sx={{ marginTop: '15px' }}>
              {coinData.length !== 0 ? (
                <Stack>
                  {coinData.map((value: any, index: number) => (
                    <Stack key={index} justifyContent="center" alignItems="center">
                      <img src={value.url} height="50" width="50" alt="" />
                      <Typography>{`${value.name}`}</Typography>
                      <Typography>{`Quantity: ${value.user_inventory.quantity}`}</Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <Stack>
                  <Typography>{t('user:inventory.noDataFound')}</Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        {data.length !== 0 ? (
          <Grid container spacing={2} className={`${styles.p10} ${styles.contents}`}>
            <Grid item md={4} mx={2}>
              <Stack className={styles.card}>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls="long-menu"
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                >
                  <FilterList />
                </IconButton>
                <Menu
                  id="long-menu"
                  MenuListProps={{
                    'aria-labelledby': 'long-button'
                  }}
                  anchorEl={anchorElement}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                    style: {
                      maxHeight: ITEM_HEIGHT * 4.5,
                      width: '20ch'
                    }
                  }}
                >
                  <MenuItem
                    style={{ display: 'block' }}
                    selected={selectedType === ''}
                    onClick={(e) => handletypeselect('')}
                  >
                    All
                  </MenuItem>
                </Menu>
                {(selectedType === '' ? data : inventory).length !== 0 ? (
                  <Stack>
                    {(selectedType === '' ? data : inventory).map((value: any, index: number) => (
                      <Card
                        key={index}
                        style={{ marginBottom: '8px', padding: '2px' }}
                        onClick={() => {
                          setState((prevState) => ({
                            ...prevState,
                            url: value.url,
                            metadata: value.metadata,
                            selectedid: value.user_inventory.userInventoryId
                          }))
                        }}
                      >
                        <Stack
                          justifyContent="center"
                          alignItems="center"
                          className={`${
                            selectedId === value.user_inventory.userInventoryId ? styles.selecteditem : ''
                          }`}
                        >
                          <img src={value.url} height="100" width="100" alt="" />
                          <Typography>{`Name: ${value.name}`}</Typography>
                          <Typography>{`Type: ${value.inventory_item_type.inventoryItemType}`}</Typography>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                ) : (
                  <Stack sx={{ color: 'black' }}>
                    <Typography>{t('user:inventory.noDataFound')}</Typography>
                  </Stack>
                )}
              </Stack>
            </Grid>
            <Grid item md={6}>
              {url !== '' && metadata.length !== 0 && (
                <Stack justifyContent="center" alignItems="center">
                  <Stack spacing={3} justifyContent="center" alignItems="center">
                    <img src={url} height="200" width="200" alt="" />
                  </Stack>
                  <Stack spacing={3} justifyContent="center" alignItems="center">
                    <Grid container spacing={3}>
                      {metadata.length !== 0 && (
                        <>
                          {JSON.parse(metadata).map((val, index) => (
                            <Grid item key={index} xs={6} md={6}>
                              <Typography variant="h6" className={styles.title}>{`${val.trait_type}:`}</Typography>
                              <Stack>
                                {val.trait_type !== 'personality' && val.trait_type !== 'age' ? (
                                  <LinearProgress variant="determinate" value={parseFloat(val.value)} />
                                ) : (
                                  <Typography className={styles.title}>{val.value}</Typography>
                                )}
                              </Stack>
                            </Grid>
                          ))}
                        </>
                      )}
                    </Grid>
                  </Stack>
                  <Stack justifyContent="center" alignItems="center" spacing={3} direction="row" className={styles.p10}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">{t('user:inventory.user')}</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={userid}
                        label="user"
                        onChange={(e: any) => {
                          setState((prevState) => ({
                            ...prevState,
                            userid: e.target.value
                          }))
                        }}
                      >
                        {user.map((datas, index) => (
                          <MenuItem style={{ display: 'block', marginRight: '18px' }} key={index} value={datas.id}>
                            {datas.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      disabled={isLoadingTransfer}
                      onClick={() => InventoryService.handleTransfer(userid, selectedId, id)}
                    >
                      {isLoadingTransfer ? <CircularProgress size={30} /> : t('user:inventory.transfer')}
                    </Button>
                  </Stack>
                </Stack>
              )}
              {url === '' && metadata.length === 0 && (
                <Stack sx={{ color: 'black' }}>
                  <Typography>{t('user:inventory.noItemSelected')}</Typography>
                </Stack>
              )}
            </Grid>
          </Grid>
        ) : (
          <Stack justifyContent="center" alignItems="center">
            <Typography className={`${styles.title} ${styles.contents}`}>{t('user:inventory.noItemsFound')}</Typography>
          </Stack>
        )}
      </Box>
    </div>
  )
}

export default InventoryContents
