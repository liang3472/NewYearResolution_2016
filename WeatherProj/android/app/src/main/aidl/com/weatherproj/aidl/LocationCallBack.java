package com.weatherproj.aidl;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by lianghangbing on 16/3/4.
 */
public class LocationCallBack implements Parcelable {

    public void onSucc(){

    }

    public void onFail(){

    }

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {

    }
}
