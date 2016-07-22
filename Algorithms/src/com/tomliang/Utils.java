package com.tomliang;

public class Utils {
	private Utils(){}
	
	public static <T> void exc(T[] arr, int index1, int index2){
		if(index1 < 0 || index2 < 0){
			throw new IllegalArgumentException("角标不能小于0");
		}
		
		if(index1 != index2){
			T temp = arr[index2];
			arr[index2] = arr[index1];
			arr[index1] = temp;
		}
	}
}
