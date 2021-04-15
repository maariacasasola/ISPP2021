package com.gotacar.backend.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.hibernate.validator.constraints.Length;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ComplaintAppeal {

    @Id
    String id;

    @DBRef
    @NotNull
    public Complaint complaint;

    @Length(max = 200)
    @NotBlank
    public String content;

    @NotNull
    public Boolean checked;

    public ComplaintAppeal() {
    }

    public ComplaintAppeal(String content, Boolean checked, Complaint complaint) {
        this.complaint = complaint;
        this.content = content;
        this.checked = checked;
    }

    @Override
    public String toString() {
        return String.format("ComplaintAppeal[id=%s, content=%s, checked=%s, complaint=%s]", id, content, checked.toString(), complaint.toString());

    }
}
