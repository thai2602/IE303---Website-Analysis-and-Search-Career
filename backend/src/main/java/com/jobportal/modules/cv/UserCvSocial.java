package com.jobportal.modules.cv;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_cv_socials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCvSocial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cv_id", nullable = false)
    private UserCv cv;

    @Column(length = 50)
    private String platform;

    @Column(columnDefinition = "TEXT")
    private String url;
}
