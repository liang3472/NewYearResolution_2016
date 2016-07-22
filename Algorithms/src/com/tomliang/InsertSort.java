package com.tomliang;

/**
 * 
 * @author lianghangbing
 * <p>插入排序</p>
 * <p>排序原理:</p>
 * <p>将一个元素插入到一个有序的数组中，插入后数组还是有序的</p>
 * <p>时间复杂度: n^2/2</p>
 * <p>成本模型:比较大小 count = (n-1)*n/2</p>
 * @param <T>
 */
public abstract class InsertSort<T> implements ISort<T> {

	public void sort(T[] arr) {
		if(arr == null){
			throw new IllegalArgumentException("数组不能为空");
		}
		
		for(int i=1; i < arr.length; i++){
			for(int j=i; j > 0 && less(arr[j-1], arr[j]); j--){
				Utils.exc(arr, j-1, j);
			}
		}
	}

	public abstract boolean less(T t1, T t2);

}
