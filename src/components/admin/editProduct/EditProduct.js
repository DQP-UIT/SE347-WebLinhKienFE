import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import Loader from '../../loader/Loader'
import ProductForm from '../productForm/ProductForm'
import {
  getProduct,
  selectIsLoading,
  selectProduct,
  updateProduct
} from '../../../redux/features/product/productSlice'
import { getCategories } from '../../../redux/features/categoryAndBrand/categoryAndBrandSlice'

const EditProduct = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isLoading = useSelector(selectIsLoading)

  const productEdit = useSelector(selectProduct)
  const [files, setFiles] = useState([])
  const [product, setProduct] = useState(productEdit)
  const [productImage, setProductImage] = useState('')
  const [imagePreview, setImagePreview] = useState([])
  const [description, setDescription] = useState('')
  const { categories, brands } = useSelector(state => state.category)

  useEffect(() => {
    dispatch(getCategories())
  }, [dispatch])

  useEffect(() => {
    dispatch(getProduct(id))
  }, [dispatch, id])

  useEffect(() => {
    setProduct(productEdit)

    if (productEdit && productEdit.image) {
      setFiles(productEdit.image)
    }

    setDescription(
      productEdit && productEdit.description ? productEdit.description : ''
    )
  }, [productEdit])

  const handleInputChange = e => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const saveProduct = async e => {
    e.preventDefault()
    if (files.length < 1) {
      return toast.info('Please add an image')
    }

    const formData = {
      name: product?.name,
      category: product?.category,
      quantity: Number(product?.quantity),
      regularPrice: product?.regularPrice,
      price: product?.price,
      description: description,
      image: files
    }

    console.log(formData)

    await dispatch(updateProduct({ id, formData }))
    // await dispatch(getProducts());
    navigate('/admin/all-products')
  }

  return (
    <div>
      {isLoading && <Loader />}
      <h3 className='--mt'>Chỉnh sửa sản phẩm</h3>
      <ProductForm
        files={files}
        setFiles={setFiles}
        product={product}
        productImage={productImage}
        imagePreview={imagePreview}
        setImagePreview={setImagePreview}
        description={description}
        setDescription={setDescription}
        handleInputChange={handleInputChange}
        saveProduct={saveProduct}
        categories={categories}
        isEditing={true}
      />
    </div>
  )
}

export default EditProduct
