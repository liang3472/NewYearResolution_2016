package com.coderstudio.tomliang.fe_webviewtool.bean;

import org.greenrobot.greendao.annotation.*;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT. Enable "keep" sections if you want to edit. 
/**
 * Entity mapped to table "FAVORITES".
 */
@Entity
public class Favorites {

    @Id
    @NotNull
    @Unique
    private String url;

    @Generated(hash = 1752129379)
    public Favorites() {
    }

    @Generated(hash = 253923671)
    public Favorites(@NotNull String url) {
        this.url = url;
    }

    @NotNull
    public String getUrl() {
        return url;
    }

    /** Not-null value; ensure this value is available before it is saved to the database. */
    public void setUrl(@NotNull String url) {
        this.url = url;
    }

}
