/*
 * Created on 04.10.2004 by laliluna
 *
 */
package de.laliluna.tutorial.library;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Iterator;
import java.util.Random;

import javax.servlet.http.HttpSession;

/**
 * @author laliluna
 *  
 */
public class SimulateDB {

    private Collection books;

    private void init(HttpSession session) {
        books = new ArrayList();
        Random random = new Random();
        books.add(new Book(random.nextLong(), "David Roos", "Struts book", true));
        books.add(new Book(random.nextLong(), "Micheal Jackson", "Java book", true));
        books.add(new Book(random.nextLong(), "Bruce Lee", "Java2 book", false));
        books.add(new Book(random.nextLong(), "Tom Jones" ,"EJB book", true));
        books.add(new Book(random.nextLong(), "Mc Donald", "Jboss for beginners", false));
        books.add(new Book(random.nextLong(), "Lars Mars", "Using Myeclipse for cooking", true));
        books.add(new Book(random.nextLong(), "Mary Jane", "EJB or spending your weekends", true));

        session.setAttribute("bookDB", books);
    }

    /**
     * load data from db;
     * @param session
     */
    private void loadData(HttpSession session) {
        //      laliluna 04.10.2004 load books from db
        books = (Collection) session.getAttribute("bookDB");
        
        // laliluna 04.10.2004 db not yet initialized, so do it
        if (books == null)
            init(session);

    }
    
    /**
     * save data to DB ;-)
     * @param session
     */
    private void saveData(HttpSession session) {
        session.setAttribute("bookDB", books);
    }

    public long saveToDB(Book book, HttpSession session) {
        // laliluna 04.10.2004 load books from db
        loadData(session);

        // laliluna 04.10.2004 loop over collection and trying to find the book
        boolean bookExist = false;
        ArrayList booksNew = (ArrayList) books;
        int index = 0;
        for (Iterator iter = books.iterator(); iter.hasNext();) {
            Book element = (Book) iter.next();
            // laliluna 04.10.2004 if book is found do an update
            if (element.getId() == book.getId()) {
            	booksNew.set(index, book);
                bookExist = true;
                break;
            }
            index++;
        }
        
        books = booksNew;
        
        // laliluna 04.10.2004 if book is not found, create a new book
        if (bookExist == false) {
            Random random = new Random();
            book.setId(random.nextLong());
            books.add(book);
        }

        // laliluna 04.10.2004 save to DB ;-)
        saveData(session);

        return book.getId();
    }

    public Book loadBookById(long id, HttpSession session) {
        // laliluna 04.10.2004 load books from db
        loadData(session);
        // laliluna 04.10.2004 loop over all books and return book if found
        for (Iterator iter = books.iterator(); iter.hasNext();) {
            Book element = (Book) iter.next();
            if (element.getId() == id) return (Book) element;
        }
        return null;
    }
    
    public void deleteBookById(long id, HttpSession session){
    	// laliluna 04.10.2004 load books from db
        loadData(session);
        Collection booksNew = new ArrayList();
        // laliluna 04.10.2004 loop over all books and delete book if found
        for (Iterator iter = books.iterator(); iter.hasNext();) {
            Book element = (Book) iter.next();
            if (element.getId() != id){
            	booksNew.add(element);
            }
        }
        // laliluna 04.10.2004 set the new books
        books = booksNew;
        
        // laliluna 04.10.2004 save to DB ;-)
        saveData(session);
    }

    public Collection getAllBooks(HttpSession session) {
        // laliluna 04.10.2004 load books from db
        loadData(session);
        return books;

    }
}