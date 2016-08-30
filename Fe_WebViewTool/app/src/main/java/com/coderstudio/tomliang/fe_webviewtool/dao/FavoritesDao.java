package com.coderstudio.tomliang.fe_webviewtool.dao;

import android.database.Cursor;
import android.database.sqlite.SQLiteStatement;

import org.greenrobot.greendao.AbstractDao;
import org.greenrobot.greendao.Property;
import org.greenrobot.greendao.internal.DaoConfig;
import org.greenrobot.greendao.database.Database;
import org.greenrobot.greendao.database.DatabaseStatement;

import com.coderstudio.tomliang.fe_webviewtool.bean.Favorites;

// THIS CODE IS GENERATED BY greenDAO, DO NOT EDIT.
/** 
 * DAO for table "FAVORITES".
*/
public class FavoritesDao extends AbstractDao<Favorites, String> {

    public static final String TABLENAME = "FAVORITES";

    /**
     * Properties of entity Favorites.<br/>
     * Can be used for QueryBuilder and for referencing column names.
    */
    public static class Properties {
        public final static Property Url = new Property(0, String.class, "url", true, "URL");
    };


    public FavoritesDao(DaoConfig config) {
        super(config);
    }
    
    public FavoritesDao(DaoConfig config, DaoSession daoSession) {
        super(config, daoSession);
    }

    /** Creates the underlying database table. */
    public static void createTable(Database db, boolean ifNotExists) {
        String constraint = ifNotExists? "IF NOT EXISTS ": "";
        db.execSQL("CREATE TABLE " + constraint + "\"FAVORITES\" (" + //
                "\"URL\" TEXT PRIMARY KEY NOT NULL UNIQUE );"); // 0: url
    }

    /** Drops the underlying database table. */
    public static void dropTable(Database db, boolean ifExists) {
        String sql = "DROP TABLE " + (ifExists ? "IF EXISTS " : "") + "\"FAVORITES\"";
        db.execSQL(sql);
    }

    @Override
    protected final void bindValues(DatabaseStatement stmt, Favorites entity) {
        stmt.clearBindings();
        stmt.bindString(1, entity.getUrl());
    }

    @Override
    protected final void bindValues(SQLiteStatement stmt, Favorites entity) {
        stmt.clearBindings();
        stmt.bindString(1, entity.getUrl());
    }

    @Override
    public String readKey(Cursor cursor, int offset) {
        return cursor.getString(offset + 0);
    }    

    @Override
    public Favorites readEntity(Cursor cursor, int offset) {
        Favorites entity = new Favorites( //
            cursor.getString(offset + 0) // url
        );
        return entity;
    }
     
    @Override
    public void readEntity(Cursor cursor, Favorites entity, int offset) {
        entity.setUrl(cursor.getString(offset + 0));
     }
    
    @Override
    protected final String updateKeyAfterInsert(Favorites entity, long rowId) {
        return entity.getUrl();
    }
    
    @Override
    public String getKey(Favorites entity) {
        if(entity != null) {
            return entity.getUrl();
        } else {
            return null;
        }
    }

    @Override
    protected final boolean isEntityUpdateable() {
        return true;
    }
    
}